const express = require('express');
const router = express.Router();
const { addTask, getTasks, updateTask,toggleTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getTasks);
router.route('/add').post(protect, addTask);
router.route('/:taskId/edittask').patch(protect, updateTask);       // ✅ Add this
router.route('/:taskId/toggletaskstatus').patch(protect, toggleTaskStatus);
router.route('/:taskId/deletetask').delete(protect, deleteTask);


module.exports = router;
