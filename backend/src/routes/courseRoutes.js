const express = require('express');
const router = express.Router();
const { initCourse, getCourses, updateTopicStatus, editCourse, addModuleWithTopics } = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getCourses);
router.route('/init').post(protect, initCourse);
router.route('/:courseId/editcourse').patch(protect, editCourse);
router.route('/:courseId/addmodule').post(protect, addModuleWithTopics);
router.route('/:courseId/modules/:moduleId/topics/:topicId/status').patch(protect, updateTopicStatus);

module.exports = router;
