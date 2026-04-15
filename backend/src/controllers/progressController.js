const Task = require('../models/Task');
const mongoose = require('mongoose');

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

module.exports = {
  getProgressSummary,
};
