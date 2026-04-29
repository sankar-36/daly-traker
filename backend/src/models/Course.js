const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});
const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCurrent: { type: Boolean, default: false },
  duration: String,
  topics: [topicSchema] // Nested Array of Topics
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
    modules: [ModuleSchema], // Array of Modules
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
courseSchema.pre('save', function () {
    let totalTopics = 0;
    let completedTopics = 0;

    // 1. Ovvoru module-kullayum loop panni topics-ah edukanum
    if (this.modules && this.modules.length > 0) {
        this.modules.forEach(module => {
            totalTopics += module.topics.length;
            completedTopics += module.topics.filter(t => t.isDone).length;
        });
    }

    // 2. Percentage calculation
    if (totalTopics > 0) {
        this.progressPercentage = Math.round((completedTopics / totalTopics) * 100);
    } else {
        this.progressPercentage = 0;
    }

    // 3. Optional: Module-oda status-um check panna ithu nalla irukkum
    // (Namala munnadi pesuna sync logic-ah ingayum podalam)
    if (this.modules) {
        this.modules.forEach(module => {
            const allDone = module.topics.length > 0 && module.topics.every(t => t.isDone);
            module.isCurrent = allDone; 
        });
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
