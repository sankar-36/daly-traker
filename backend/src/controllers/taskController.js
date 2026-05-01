const Task = require('../models/Task');

// @desc    Create a new daily task
// @route   POST /api/tasks/add
// @access  Private
const addTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, time } = req.body;

    // ✅ Validation
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

    // ✅ Create task
    const task = new Task({
      user_id: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority,
      category,
      time,
      isCompleted: false,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user_id: req.user._id });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, time } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // ✅ மாத்தினது மட்டும் update பண்ணு
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

    const updatedTask = await task.save();
    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });

  } catch (error) {
    next(error);
  }
};
const { updateDailyLog } = require('../utils/logHelper');
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

    // ✅ Boolean flip
    task.isCompleted = !task.isCompleted;

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
// @route   DELETE /api/tasks/:id
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
