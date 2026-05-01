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
    const { title, description, modules } = req.body;

    // 1. Data Validation: Title illaama course create panna koodathu
    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Please add a course title');
    }

    // 2. Validate each module has a title (required by ModuleSchema)
    const rawModules = modules || [];
    for (let i = 0; i < rawModules.length; i++) {
      if (!rawModules[i].title || !rawModules[i].title.trim()) {
        res.status(400);
        throw new Error(`Module at index ${i} is missing a title`);
      }
    }

    // 3. New Object Instantiation (Puthu Structure-oda)
    const course = new Course({
      user_id: req.user._id, // Auth middleware-la irunthu varum
      title: title.trim(),
      description,
      modules: rawModules.map((mod) => ({
        title: mod.title.trim(),
        // Note: isCurrent is NOT set here — the pre-save hook controls it
        topics: (mod.topics || [])
          .map((topic) => ({
            title: typeof topic === 'string' ? topic.trim() : (topic.title || '').trim(),
            isDone: topic.isDone ?? false,
          }))
          .filter((topic) => topic.title), // filter out topics with no title (required field)
      })),
    });

    // 4. Save to Database
    // Inga save aagum pothu namma Model-la ezhuthuna 'pre-save' middleware
    // automatic-ah progress-ah calculate pannidum.
    const createdCourse = await course.save();

    res.status(201).json(createdCourse);
  } catch (error) { next(error); }
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
const editCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description, modules } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (course.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // ✅ Title update
    if (title && title.trim()) {
      course.title = title.trim();
    }

    // ✅ Description update
    if (description !== undefined) {
      course.description = description;
    }

    // ✅ Modules update — draft-ல இருந்து வர்றதை replace பண்ணு
    if (modules && Array.isArray(modules)) {
      course.modules = modules.map((mod, index) => ({
        _id: mod._id,  // existing id வச்சிரு
        title: (mod.title || '').trim(),
        isCurrent: mod.isCurrent ?? false,
        order: mod.order ?? index,
        topics: (mod.topics || []).map((topic) => ({
          _id: topic._id,  // existing id வச்சிரு
          title: typeof topic === 'string' ? topic : (topic.title || '').trim(),
          isDone: topic.isDone ?? false,
        })).filter((t) => t.title),
      })).filter((m) => m.title);
    }

    const updatedCourse = await course.save();
    res.json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Add module with topics to course
// @route   POST /api/courses/:courseId/modules
// @access  Private
// ============================================
const addModuleWithTopics = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, topics } = req.body;

    // ✅ Module title validation
    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Module title is required');
    }

    // ✅ Topics validation
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      res.status(400);
      throw new Error('At least one topic is required');
    }

    // ✅ Course கண்டுபிடி
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // ✅ Authorization
    if (course.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // ✅ Topics build பண்ணு
    const normalizedTopics = topics
      .map((t) => ({
        title: (typeof t === 'string' ? t : t.title || '').trim(),
        isDone: false,
      }))
      .filter((t) => t.title); // empty title filter பண்ணு

    if (normalizedTopics.length === 0) {
      res.status(400);
      throw new Error('No valid topics provided');
    }

    // ✅ Module build பண்ணு
    const newModule = {
      title: title.trim(),
      isCurrent: false,
      order: course.modules.length,
      topics: normalizedTopics,
    };

    // ✅ Course-ல push பண்ணு
    course.modules.push(newModule);
    const updatedCourse = await course.save();

    // ✅ புதுசா add ஆன module return பண்ணு
    const addedModule = updatedCourse.modules[updatedCourse.modules.length - 1];

    res.status(201).json({
      message: 'Module with topics added successfully ✅',
      module: addedModule,
      totalModules: updatedCourse.modules.length,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific topic status and course overall completion
// @route   PUT /api/courses/:courseId/topics/:topicId
// @access  Private
const { updateDailyLog } = require('../utils/logHelper');
const updateTopicStatus = async (req, res, next) => {
  try {
    const { courseId, moduleId, topicId } = req.params;
    const { isDone } = req.body;

    // ✅ Validation
    if (typeof isDone !== 'boolean') {
      res.status(400);
      throw new Error('isDone must be true or false');
    }

    // ✅ Course கண்டுபிடி
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // ✅ Authorization
    if (course.user_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // ✅ Module கண்டுபிடி
    const moduleIndex = course.modules.findIndex(
      (m) => m._id.toString() === moduleId
    );
    if (moduleIndex === -1) {
      res.status(404);
      throw new Error('Module not found');
    }

    // ✅ Topic கண்டுபிடி
    const topicIndex = course.modules[moduleIndex].topics.findIndex(
      (t) => t._id.toString() === topicId
    );
    if (topicIndex === -1) {
      res.status(404);
      throw new Error('Topic not found');
    }

    // ✅ Status update பண்ணு
    course.modules[moduleIndex].topics[topicIndex].isDone = isDone;

    // ✅ Save — pre-save middleware progress calculate பண்ணும்
    const updatedCourse = await course.save();
    await updateDailyLog(req.user._id);

    // Updated topic மட்டும் return பண்ணு
    const updatedTopic = updatedCourse.modules[moduleIndex].topics[topicIndex];

    res.json({
      message: `Topic marked as ${isDone ? 'completed ✅' : 'incomplete ⬜'}`,
      topic: updatedTopic,
      // Overall progress also return பண்ணு
      progressPercentage: updatedCourse.progressPercentage,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  initCourse,
  getCourses,
  addModuleWithTopics,
  updateTopicStatus,
  editCourse,
};
