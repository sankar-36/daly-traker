const Task = require('../models/Task');
const Course = require('../models/Course');
const DailyLog = require('../models/DailyLog');
const mongoose = require('mongoose');
const { updateDailyLog } = require('../utils/logHelper');

const toDateKey = (date) => date.toISOString().split('T')[0];

const getHeatValue = (streakValue = 0) => {
  if (streakValue >= 100) return 4;
  if (streakValue >= 80) return 3;
  if (streakValue >= 40) return 2;
  if (streakValue > 0) return 1;
  return 0;
};

const buildStreakHeatmap = (logs) => {
  const weeks = 18;
  const days = 7;
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - weeks * days + 1);

  const logMap = new Map(logs.map((log) => [log.date, log.streakValue || 0]));
  const grid = [];
  const monthLabels = [];
  const seenMonths = new Set();

  for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
    const week = [];
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + weekIndex * days);
    const month = weekStart.toLocaleString('en-US', { month: 'short' });

    if (!seenMonths.has(month)) {
      monthLabels.push(month);
      seenMonths.add(month);
    }

    for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + dayIndex);
      week.push(getHeatValue(logMap.get(toDateKey(date))));
    }

    grid.push(week);
  }

  return { grid, months: monthLabels };
};

// @desc    Fetch percentage data for weekly/monthly graphs
// @route   GET /api/progress/summary
// @access  Private
const getProgressSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Daily / Weekly / Monthly grouping example
    // We will group by status (Completed / Pending) to give a completion rate

    const tasksPipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ];

    const tasksStats = await Task.aggregate(tasksPipeline);

    // Format for graphing library (Chart.js / Recharts)
    // Here we're transforming raw aggregations into label/value arrays
    const formattedData = {
      labels: [],
      completed: [],
      pending: [],
      overdue: []
    };

    // simplified parsing: just an example of how you might aggregate it per day
    const aggregatedByDate = {};
    
    tasksStats.forEach(stat => {
      const { year, month, day, status } = stat._id;
      const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      if (!aggregatedByDate[dateKey]) {
        aggregatedByDate[dateKey] = { Complete: 0, Pending: 0, Overdue: 0 };
      }
      aggregatedByDate[dateKey][status] = stat.count;
    });

    Object.keys(aggregatedByDate).sort().forEach(date => {
      formattedData.labels.push(date);
      formattedData.completed.push(aggregatedByDate[date].Complete || 0);
      formattedData.pending.push(aggregatedByDate[date].Pending || 0);
      formattedData.overdue.push(aggregatedByDate[date].Overdue || 0);
    });

    // You could easily expand this endpoint to allow ?timeframe=weekly or ?timeframe=monthly

    res.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Fetch user streak heatmap data
// @route   GET /api/progress/streak
// @access  Private
const getStreakHeatmap = async (req, res, next) => {
  try {
    await updateDailyLog(req.user._id);
    const logs = await DailyLog.find({ user_id: req.user._id }).sort({ date: 1 });
    res.json(buildStreakHeatmap(logs));
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch full progress overview for the Progress page
// @route   GET /api/progress/overview
// @access  Private
const getProgressOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all data in parallel
    const [tasks, courses, logs] = await Promise.all([
      Task.find({ user_id: userId }),
      Course.find({ user_id: userId }),
      DailyLog.find({ user_id: userId }).sort({ date: 1 }),
    ]);

    // ── 1. Stat Cards ──────────────────────────────────

    // Total Study Time — estimate from daily logs (each log day = streakValue mapped to hours)
    const totalMinutes = logs.reduce((sum, log) => {
      // Map streak value to approximate study minutes for that day
      const sv = log.streakValue || 0;
      if (sv >= 80) return sum + 180;  // ~3h
      if (sv >= 60) return sum + 120;  // ~2h
      if (sv >= 40) return sum + 60;   // ~1h
      if (sv > 0) return sum + 30;     // ~30m
      return sum;
    }, 0);
    const studyHours = Math.floor(totalMinutes / 60);
    const studyMinutes = totalMinutes % 60;

    // Tasks Completed
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;

    // Courses Finished (100% progress)
    const finishedCourses = courses.filter(c => c.progressPercentage === 100).length;
    const totalCourses = courses.length;

    // Focus Efficiency — ratio of completed vs total tasks as percentage
    const focusEfficiency = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Comparison stats
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);
    const todayKey = toDateKey(now);

    // Last week's logs
    const lastWeekLogs = logs.filter(l => {
      const d = new Date(l.date);
      return d >= oneWeekAgo && d <= now;
    });
    const prevWeekLogs = logs.filter(l => {
      const d = new Date(l.date);
      return d >= twoWeeksAgo && d < oneWeekAgo;
    });

    const lastWeekMinutes = lastWeekLogs.reduce((s, l) => {
      const sv = l.streakValue || 0;
      if (sv >= 80) return s + 180;
      if (sv >= 60) return s + 120;
      if (sv >= 40) return s + 60;
      if (sv > 0) return s + 30;
      return s;
    }, 0);
    const prevWeekMinutes = prevWeekLogs.reduce((s, l) => {
      const sv = l.streakValue || 0;
      if (sv >= 80) return s + 180;
      if (sv >= 60) return s + 120;
      if (sv >= 40) return s + 60;
      if (sv > 0) return s + 30;
      return s;
    }, 0);
    const studyTimeChange = prevWeekMinutes === 0 ? 0 : Math.round(((lastWeekMinutes - prevWeekMinutes) / prevWeekMinutes) * 100);

    // Yesterday's completed tasks
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);
    const yesterdayLog = logs.find(l => l.date === yesterdayKey);
    const tasksSinceYesterday = yesterdayLog ? completedTasks - (yesterdayLog.task?.completedTasks || 0) : 0;

    // ── 2. Weekly Performance (last 7 days) ─────────────

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyPerformance = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = toDateKey(d);
      const log = logs.find(l => l.date === key);
      const sv = log?.streakValue || 0;

      // Map streak value to hours for display
      let actualHours = 0;
      if (sv >= 80) actualHours = 7;
      else if (sv >= 60) actualHours = 5;
      else if (sv >= 40) actualHours = 3.5;
      else if (sv > 0) actualHours = 2;

      weeklyPerformance.push({
        day: dayNames[d.getDay()],
        actual: actualHours,
        target: 6, // target goal of 6 hours per day
      });
    }

    // ── 3. Task Distribution (by category) ──────────────

    const categoryCount = { study: 0, work: 0, personal: 0 };
    tasks.forEach(t => {
      if (categoryCount.hasOwnProperty(t.category)) {
        categoryCount[t.category]++;
      }
    });
    const taskDistribution = Object.entries(categoryCount).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
      percentage: totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100),
    }));

    // ── 4. Active Course Progress ───────────────────────

    const activeCourses = courses
      .filter(c => c.progressPercentage < 100)
      .map(c => ({
        title: c.title,
        progress: c.progressPercentage || 0,
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);

    // ── Response ────────────────────────────────────────

    res.json({
      stats: {
        totalStudyTime: `${studyHours}h ${studyMinutes}m`,
        studyTimeChange,
        tasksCompleted: completedTasks,
        tasksSinceYesterday,
        coursesFinished: finishedCourses,
        totalCourses,
        focusEfficiency,
      },
      weeklyPerformance,
      taskDistribution,
      activeCourses,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgressSummary,
  getStreakHeatmap,
  getProgressOverview,
};
