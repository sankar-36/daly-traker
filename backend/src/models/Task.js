const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'study'],
      required: [true, 'Category is required'],
    },
    time: {
      type: String,
      required: [true, 'Task time is required'],
      match: [
        /^([0-1]?\d|2[0-3]):[0-5]\d$/,
        'Time must be in HH:MM format (e.g. 09:30)',
      ],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // Calendar date (YYYY-MM-DD) on which this task was last marked complete.
    // If this doesn't match today's date, the task is auto-reset to incomplete.
    completedDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
