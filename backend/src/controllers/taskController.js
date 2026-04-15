const Task = require('../models/Task');

// @desc    Create a new daily task
// @route   POST /api/tasks/add
// @access  Private
const addTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const task = new Task({
      user_id: req.user._id,
      title,
      description,
      dueDate,
      status: status || 'Pending',
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
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.user_id.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this task');
      }

      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.status = req.body.status || task.status;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
      console.log("Task user:", task.user_id.toString());
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.user_id.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this task');
      }

      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
};
