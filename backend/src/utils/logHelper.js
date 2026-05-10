const DailyLog = require('../models/DailyLog');
const Task = require('../models/Task');
const Course = require('../models/Course');
const { getStreakColor, calculateStreakValue } = require('./streakHelper');
const { getTodayKey, resetStaleDailyTasks } = require('./taskResetHelper');

const updateDailyLog = async (userId) => {
  try {
    const today = getTodayKey();

    await resetStaleDailyTasks(userId);

    // ────────────────────────────────
    // ✅ STEP 1: Task — இப்போ என்ன நிலையில் இருக்கு
    // ────────────────────────────────
    const allTasks = await Task.find({ user_id: userId });
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.isCompleted).length;
    const taskPct = totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

    // ────────────────────────────────
    // ✅ STEP 2: Course Topics — இப்போ என்ன நிலையில் இருக்கு
    // ────────────────────────────────
    const allCourses = await Course.find({ user_id: userId });
    const allTopics = allCourses.flatMap((course) => {
      const modules = Array.isArray(course.modules) ? course.modules : [];

      return modules.flatMap((module) =>
        Array.isArray(module.topics) ? module.topics : []
      );
    });
    const totalTopics = allTopics.length;
    const completedTopics = allTopics.filter((t) => t.isDone).length;
    const coursePct = totalTopics === 0
      ? 0
      : Math.round((completedTopics / totalTopics) * 100);

    // ────────────────────────────────
    // ✅ STEP 3: Streak calculate
    // ────────────────────────────────
    const streakValue = calculateStreakValue(taskPct, coursePct);
    const streakColor = getStreakColor(streakValue);

    // ────────────────────────────────
    // ✅ STEP 4: Upsert — இருந்தா update, இல்லன்னா create
    // User uncomplete பண்ணாலும் correct data save ஆகும்!
    // ────────────────────────────────
    await DailyLog.findOneAndUpdate(
      { user_id: userId, date: today },
      {
        $set: {
          task: {
            totalTasks,
            completedTasks,
            completionPercentage: taskPct,
          },
          course: {
            totalTopics,
            completedTopics,
            completionPercentage: coursePct,
          },
          streakValue,
          streakColor,
        },
      },
      { upsert: true, new: true }
    );

    console.log(`✅ DailyLog updated — ${today}`);
    console.log(`   Task: ${completedTasks}/${totalTasks} (${taskPct}%)`);
    console.log(`   Course: ${completedTopics}/${totalTopics} (${coursePct}%)`);
    console.log(`   Streak: ${streakValue} → ${streakColor}`);

  } catch (error) {
    console.error('❌ DailyLog update failed:', error);
  }
};

module.exports = { updateDailyLog };
