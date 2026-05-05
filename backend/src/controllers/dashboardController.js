const Course = require('../models/Course');
const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');
const { calculateStreakValue, getStreakColor } = require('../utils/streakHelper');

const toDateKey = (date) => date.toISOString().split('T')[0];

const getCourseStats = (courses) => {
  const totals = courses.reduce(
    (acc, course) => {
      const modules = Array.isArray(course.modules) ? course.modules : [];

      modules.forEach((module) => {
        const topics = Array.isArray(module.topics) ? module.topics : [];

        topics.forEach((topic) => {
          acc.totalTopics += 1;
          if (topic.isDone) acc.completedTopics += 1;
        });
      });

      return acc;
    },
    { totalTopics: 0, completedTopics: 0 }
  );

  const progress =
    totals.totalTopics === 0
      ? 0
      : Math.round((totals.completedTopics / totals.totalTopics) * 100);

  return {
    ...totals,
    progress,
    activeCourses: courses.filter(
      (course) => Number(course.progressPercentage || 0) < 100
    ).length,
  };
};

const getTaskStats = (tasks) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const remainingTasks = totalTasks - completedTasks;
  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return {
    totalTasks,
    completedTasks,
    remainingTasks,
    completionPercentage,
  };
};

const getWeeklyLongevity = (logs, fallbackValue) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6);

  const weeklyLogs = logs.filter((log) => {
    const logDate = new Date(`${log.date}T00:00:00.000Z`);
    return logDate >= startDate && logDate <= today;
  });

  if (weeklyLogs.length === 0) {
    return fallbackValue;
  }

  const total = weeklyLogs.reduce((sum, log) => sum + (log.streakValue || 0), 0);
  return Math.round(total / 7);
};

const buildStreakCalendar = (logs, fallbackValue, fallbackColor) => {
  const logMap = new Map(
    logs.map((log) => [
      log.date,
      {
        value: log.streakValue || 0,
        color: log.streakColor || 'none',
      },
    ])
  );

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 111);

  return Array.from({ length: 112 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateKey = toDateKey(date);
    const storedLog = logMap.get(dateKey);
    const isToday = dateKey === toDateKey(today);

    return {
      date: dateKey,
      month: date.toLocaleString('en-US', { month: 'short' }),
      value: storedLog?.value ?? (isToday ? fallbackValue : 0),
      color: storedLog?.color ?? (isToday ? fallbackColor : 'none'),
    };
  });
};

// @desc    Fetch dashboard metrics and streak activity
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [courses, tasks, logs] = await Promise.all([
      Course.find({ user_id: userId }),
      Task.find({ user_id: userId }),
      DailyLog.find({ user_id: userId }).sort({ date: 1 }),
    ]);

    const course = getCourseStats(courses);
    const task = getTaskStats(tasks);
    const fallbackStreakValue = calculateStreakValue(
      task.completionPercentage,
      course.progress
    );
    const fallbackStreakColor = getStreakColor(fallbackStreakValue);
    const streak = buildStreakCalendar(logs, fallbackStreakValue, fallbackStreakColor);

    res.json({
      courseProgress: course.progress,
      activeCourses: course.activeCourses,
      tasksRemaining: task.remainingTasks,
      weeklyLongevity: getWeeklyLongevity(logs, fallbackStreakValue),
      streak,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
