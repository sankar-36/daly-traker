const express = require('express');
const router = express.Router();
const { addTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getTasks);
router.route('/add').post(protect, addTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
