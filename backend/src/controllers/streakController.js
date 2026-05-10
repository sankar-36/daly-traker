const Task   = require('../models/Task');
const Course = require('../models/Course');
const { calculateStreakValue, getStreakColor } = require('../utils/streakHelper');
const { getTodayKey, resetStaleDailyTasks } = require('../utils/taskResetHelper');

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the start and end of "today" in UTC so Mongoose date comparisons
 * work correctly regardless of server timezone.
 */
const getTodayRange = () => {
  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
};

// ── controller ────────────────────────────────────────────────────────────────

/**
 * @desc   Calculate today's streak value and return the matching color code
 * @route  GET /api/streak/today
 * @access Private
 *
 * Logic
 * ─────
 *  1. Count tasks the user completed TODAY (isCompleted=true, updatedAt within today).
 *  2. Count course topics the user marked done TODAY (isDone=true, updatedAt within today).
 *  3. Feed both counts into calculateTodayStreakValue() from streakHelper.
 *  4. Map the resulting score to a hex color via getStreakColor().
 *  5. Return JSON with streakValue, streakColor, and the raw counts for transparency.
 */
const getTodayStreak = async (req, res, next) => {
  try {
    const userId           = req.user._id;
    const { start, end }   = getTodayRange();
    const todayKey         = getTodayKey();

    await resetStaleDailyTasks(userId);

    // ── STEP 1: Tasks completed today ────────────────────────────────────
    const tasksCompletedToday = await Task.countDocuments({
      user_id     : userId,
      isCompleted : true,
      completedDate: todayKey,
    });

    // ── STEP 2: Course topics marked done today ───────────────────────────
    // Topics live inside Course → modules[] → topics[].
    // We use an aggregation pipeline to flatten and filter in one pass.
    const topicAgg = await Course.aggregate([
      // Only this user's courses
      { $match: { user_id: userId } },

      // Flatten modules array
      { $unwind: { path: '$modules', preserveNullAndEmpty: false } },

      // Flatten topics array
      { $unwind: { path: '$modules.topics', preserveNullAndEmpty: false } },

      // Keep only topics that are done AND were updated today
      {
        $match: {
          'modules.topics.isDone'    : true,
          'modules.topics.updatedAt' : { $gte: start, $lte: end },
        },
      },

      // Count them
      { $count: 'topicsCompletedToday' },
    ]);

    // aggregation returns [] when nothing matched, so default to 0
    const topicsCompletedToday =
      topicAgg.length > 0 ? topicAgg[0].topicsCompletedToday : 0;

    // ── STEP 3: Calculate totals and today's completion percentages ──────
    const totalTasks = await Task.countDocuments({ user_id: userId });

    const userCourses = await Course.find({ user_id: userId });
    let totalTopics = 0;
    userCourses.forEach((course) => {
      if (Array.isArray(course.modules)) {
        course.modules.forEach((m) => {
          if (Array.isArray(m.topics)) totalTopics += m.topics.length;
        });
      }
    });

    const taskPctToday = totalTasks === 0 ? 0 : Math.round((tasksCompletedToday / totalTasks) * 100);
    const coursePctToday = totalTopics === 0 ? 0 : Math.round((topicsCompletedToday / totalTopics) * 100);

    // ── STEP 4: Calculate streak value (uses percentages) and map to color ─
    const streakValue = calculateStreakValue(taskPctToday, coursePctToday);
    const streakColor = getStreakColor(streakValue);

    // ── STEP 5: Respond ──────────────────────────────────────────────────
    console.log(`✅ Today's Streak — Tasks: ${tasksCompletedToday}/${totalTasks} (${taskPctToday}%), Topics: ${topicsCompletedToday}/${totalTopics} (${coursePctToday}%)`);
    console.log(`   Streak value: ${streakValue} → color: ${streakColor}`);

    res.json({
      streakValue,
      streakColor,
      details: {
        tasksCompletedToday,
        totalTasks,
        taskPctToday,
        topicsCompletedToday,
        totalTopics,
        coursePctToday,
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getTodayStreak };
