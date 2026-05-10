const Task = require('../models/Task');

const getTodayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const resetStaleDailyTasks = async (userId) => {
  const today = getTodayKey();

  const result = await Task.updateMany(
    {
      user_id: userId,
      isCompleted: true,
      completedDate: { $ne: today },
    },
    {
      $set: {
        isCompleted: false,
        completedDate: null,
      },
    }
  );

  return {
    today,
    resetCount: result.modifiedCount || 0,
  };
};

module.exports = {
  getTodayKey,
  resetStaleDailyTasks,
};
