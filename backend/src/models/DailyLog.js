const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    //  Date — YYYY-MM-DD format (time இல்லாம)
    date: {
      type: String,
      required: true,
    },

    //  Task completion data
    task: {
      totalTasks: { type: Number, default: 0 },
      completedTasks: { type: Number, default: 0 },
      completionPercentage: { type: Number, default: 0 },
    },

    //  Course topic completion data
    course: {
      totalTopics: { type: Number, default: 0 },
      completedTopics: { type: Number, default: 0 },
      completionPercentage: { type: Number, default: 0 },
    },

    //  Streak color  logic
    // task % + course % average color decide 
    streakValue: {
      type: Number,
      default: 0, // 0, 20, 40, 60, 80, 100
    },

    streakColor: {
      type: String,
      default: 'none', // none, light, medium, good, great, perfect
    },
  },
  { timestamps: true }
);


dailyLogSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);