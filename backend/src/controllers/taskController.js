const Task = require('../models/Task');
const { updateDailyLog } = require('../utils/logHelper');
const { getTodayKey, resetStaleDailyTasks } = require('../utils/taskResetHelper');

const normalizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

// @desc    Create a new daily task
// @route   POST /api/tasks/add
// @access  Private
const addTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, time, isCompleted } = req.body;

    const normalizedTitle = normalizeString(title);
    const normalizedDescription =
      description === undefined ? '' : normalizeString(description);
    const normalizedTime = normalizeString(time);

    //  Validation
    if (!normalizedTitle) {
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

    if (!normalizedTime) {
      res.status(400);
      throw new Error('Time is required');
    }

    const done = typeof isCompleted === 'boolean' ? isCompleted : false;

    //  Create task
    const task = new Task({
      user_id: req.user._id,
      title: normalizedTitle,
      description: normalizedDescription,
      priority,
      category,
      time: normalizedTime,
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
    const { resetCount } = await resetStaleDailyTasks(req.user._id);

    if (resetCount > 0) {
      await updateDailyLog(req.user._id);
    }

    const tasks = await Task.find({ user_id: req.user._id });
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

    if (title !== undefined) {
      const normalizedTitle = normalizeString(title);
      if (!normalizedTitle) {
        res.status(400);
        throw new Error('Task title is required');
      }
      task.title = normalizedTitle;
    }

    if (description !== undefined) task.description = normalizeString(description);

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

    if (time !== undefined) {
      const normalizedTime = normalizeString(time);
      if (!normalizedTime) {
        res.status(400);
        throw new Error('Time is required');
      }
      task.time = normalizedTime;
    }

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
