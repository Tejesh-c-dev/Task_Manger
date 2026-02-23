const router = require('express').Router();
const {
  getAllTasks,
  getTask,
  addTask,
  updateTask,
  toggleStatus,
  deleteTask,
  deleteCompletedTasks,
  getTaskStats,
  getTasksByPriority,
} = require('../controllers/controller');
const { protect } = require('../middleware/auth');
const {
  validateCreateTask,
  validateUpdateTask,
  validateObjectId,
} = require('../middleware/validate');

// All task routes require authentication
router.use(protect);

// Task statistics (must be before :id routes)
router.get('/stats', getTaskStats);

// Delete all completed tasks
router.delete('/completed', deleteCompletedTasks);

// Get tasks by priority
router.get('/priority/:priority', getTasksByPriority);

// CRUD operations
router.route('/')
  .get(getAllTasks)
  .post(validateCreateTask, addTask);

router.route('/:id')
  .get(validateObjectId, getTask)
  .put(validateUpdateTask, updateTask)
  .delete(validateObjectId, deleteTask);

// Toggle task completion
router.put('/:id/toggle', validateObjectId, toggleStatus);

module.exports = router;