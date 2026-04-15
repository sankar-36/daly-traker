const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new mongoose.Schema(
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
    topics: [topicSchema],
    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate progress before saving
courseSchema.pre('save', function (next) {
  if (this.topics && this.topics.length > 0) {
    const completedTopics = this.topics.filter((topic) => topic.completed).length;
    this.progressPercentage = Math.round((completedTopics / this.topics.length) * 100);
  } else {
    this.progressPercentage = 0;
  }
  ;
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
