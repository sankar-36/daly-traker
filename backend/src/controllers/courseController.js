const Course = require('../models/Course');

// normalize various topics input shapes into an array of topic objects
const normalizeTopics = (topics) => {
  if (!topics) return [];

  if (Array.isArray(topics)) {
    return topics
      .map((t) => {
        if (typeof t === 'string') return { title: t.trim(), completed: false };
        if (t && typeof t === 'object') return { title: (t.title || '').toString().trim(), completed: !!t.completed };
        return null;
      })
      .filter(Boolean)
      .filter((t) => t.title);
  }

  if (typeof topics === 'string') {
    return topics
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ title: s, completed: false }));
  }

  return [];
};

// @desc    Start a new course and define topics
// @route   POST /api/courses/init
// @access  Private
const initCourse = async (req, res, next) => {
  try {
    const { title, description, topics } = req.body;
    const normalized = normalizeTopics(topics);

    const course = new Course({
      user_id: req.user._id,
      title,
      description,
      topics: normalized,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ user_id: req.user._id });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Append one or many topics to an existing course
// @route   POST /api/courses/:courseId/topics
// @access  Private
const addTopics = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { topics } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (course.user_id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this course');
    }

    const newTopics = normalizeTopics(topics);
    if (!newTopics || newTopics.length === 0) {
      res.status(400);
      throw new Error('No topics provided');
    }

    // append new topics
    course.topics = course.topics.concat(newTopics);

    // `.save()` middleware handles progressPercentage recalculation
    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific topic status and course overall completion
// @route   PUT /api/courses/:courseId/topics/:topicId
// @access  Private
const updateTopicStatus = async (req, res, next) => {
  try {
    const { courseId, topicId } = req.params;
    const { completed } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (course.user_id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this course');
    }

    const topicIndex = course.topics.findIndex(
      (t) => t._id.toString() === topicId
    );

    if (topicIndex === -1) {
      res.status(404);
      throw new Error('Topic not found');
    }

    course.topics[topicIndex].completed = completed;
    
    // `.save()` middleware handles progressPercentage recalculation
    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initCourse,
  getCourses,
  updateTopicStatus,
  addTopics,
};
