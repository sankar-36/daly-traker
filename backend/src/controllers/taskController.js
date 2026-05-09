const Task = require('../models/Task');
const { updateDailyLog } = require('../utils/logHelper');

// Returns today's date as "YYYY-MM-DD" in local time
const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Create a new daily task
// @route   POST /api/tasks/add
// @access  Private
const addTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, time, isCompleted } = req.body;

    //  Validation
    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    if (!category) {
      res.status(400);
      throw new Error('Category is required (work / personal / study)');
    }

    if (!['work', 'personal', 'study'].includes(category)) {
      res.status(400);
      throw new Error('Category must be work, personal, or study');
    }

    if (!priority) {
      res.status(400);
      throw new Error('Priority is required (high / medium / low)');
    }

    if (!['high', 'medium', 'low'].includes(priority)) {
      res.status(400);
      throw new Error('Priority must be high, medium, or low');
    }

    if (!time) {
      res.status(400);
      throw new Error('Time is required');
    }

    const done = typeof isCompleted === 'boolean' ? isCompleted : false;

    //  Create task
    const task = new Task({
      user_id: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority,
      category,
      time,
      isCompleted: done,
      completedDate: done ? getTodayKey() : null,
    });

    const createdTask = await task.save();
    await updateDailyLog(req.user._id);
    res.status(201).json(createdTask);

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tasks — auto-resets tasks completed on a previous day
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const today = getTodayKey();
    const tasks = await Task.find({ user_id: req.user._id });

    // Find tasks that were marked complete on a past date
    const staleIds = tasks
      .filter((t) => t.isCompleted && t.completedDate !== today)
      .map((t) => t._id);

    if (staleIds.length > 0) {
      // Reset them in the DB in one bulk operation
      await Task.updateMany(
        { _id: { $in: staleIds } },
        { $set: { isCompleted: false, completedDate: null } }
      );

      // Update the daily log to reflect the reset
      await updateDailyLog(req.user._id);

      // Re-fetch the now-correct tasks
      const freshTasks = await Task.find({ user_id: req.user._id });
      return res.json(freshTasks);
    }

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PATCH /api/tasks/:taskId/edittask
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, time, isCompleted } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    if (title && title.trim()) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();

    if (priority) {
      if (!['high', 'medium', 'low'].includes(priority)) {
        res.status(400);
        throw new Error('Priority must be high, medium, or low');
      }
      task.priority = priority;
    }

    if (category) {
      if (!['work', 'personal', 'study'].includes(category)) {
        res.status(400);
        throw new Error('Category must be work, personal, or study');
      }
      task.category = category;
    }

    if (time) task.time = time;

    if (typeof isCompleted === 'boolean') {
      task.isCompleted = isCompleted;
      task.completedDate = isCompleted ? getTodayKey() : null;
    }

    const updatedTask = await task.save();
    await updateDailyLog(req.user._id);
    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:taskId/toggletaskstatus
// @access  Private
const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Flip completion and track the calendar date
    task.isCompleted = !task.isCompleted;
    task.completedDate = task.isCompleted ? getTodayKey() : null;

    const updatedTask = await task.save();
    await updateDailyLog(req.user._id);

    res.json({
      message: `Task marked as ${updatedTask.isCompleted ? 'completed ✅' : 'incomplete ⬜'}`,
      task: updatedTask,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId/deletetask
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    await task.deleteOne();
    await updateDailyLog(req.user._id);
    res.json({ message: 'Task deleted successfully' });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTask,
  getTasks,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
