const express = require('express');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes require login
router.use(protect);

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET single task
router.get('/:id', taskController.getTaskById);

// POST create task
router.post('/', taskController.createTask);

// PATCH update task
router.patch('/:id', taskController.updateTask);

// DELETE task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
