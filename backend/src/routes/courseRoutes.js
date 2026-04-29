const express = require('express');
const router = express.Router();
const { initCourse, getCourses, updateTopicStatus, editCourse } = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getCourses);
router.route('/init').post(protect, initCourse);
router.route('/:courseId/editcourse').patch(protect, editCourse);
router.route('/:courseId/topics/:topicId').put(protect, updateTopicStatus);

module.exports = router;
