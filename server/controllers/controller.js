const Task = require('../models/Task');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get all tasks for logged in user
 * @route   GET /api/v1/tasks
 * @access  Private
 */
const getAllTasks = asyncHandler(async (req, res, next) => {
  const { completed, priority, category, sort, page = 1, limit = 50 } = req.query;

  // Build query
  const query = { user: req.user._id };

  // Filter by completion status
  if (completed !== undefined) {
    query.completed = completed === 'true';
  }

  // Filter by priority
  if (priority) {
    query.priority = priority;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Build sort object
  let sortObj = { createdAt: -1 }; // Default: newest first
  if (sort) {
    const sortFields = sort.split(',').reduce((acc, field) => {
      const order = field.startsWith('-') ? -1 : 1;
      const fieldName = field.replace(/^-/, '');
      acc[fieldName] = order;
      return acc;
    }, {});
    sortObj = sortFields;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [tasks, total] = await Promise.all([
    Task.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
    Task.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: tasks,
  });
});

/**
 * @desc    Get a single task
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
const getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
const addTask = asyncHandler(async (req, res, next) => {
  // Add user to request body
  req.body.user = req.user._id;

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

/**
 * @desc    Update a task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Update task
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

/**
 * @desc    Toggle task completion status
 * @route   PUT /api/v1/tasks/:id/toggle
 * @access  Private
 */
const toggleStatus = asyncHandler(async (req, res, next) => {
  let task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date() : null;
  await task.save();

  res.status(200).json({
    success: true,
    message: task.completed ? 'Task marked as completed' : 'Task marked as pending',
    data: task,
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {},
  });
});

/**
 * @desc    Delete all completed tasks
 * @route   DELETE /api/v1/tasks/completed
 * @access  Private
 */
const deleteCompletedTasks = asyncHandler(async (req, res, next) => {
  const result = await Task.deleteMany({
    user: req.user._id,
    completed: true,
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} completed task(s) deleted`,
    data: { deletedCount: result.deletedCount },
  });
});

/**
 * @desc    Get task statistics
 * @route   GET /api/v1/tasks/stats
 * @access  Private
 */
const getTaskStats = asyncHandler(async (req, res, next) => {
  const stats = await Task.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] },
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] },
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$completed', false] },
                  { $ne: ['$dueDate', null] },
                  { $lt: ['$dueDate', new Date()] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const defaultStats = {
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    overdue: 0,
  };

  res.status(200).json({
    success: true,
    data: stats[0] || defaultStats,
  });
});

/**
 * @desc    Get tasks by priority
 * @route   GET /api/v1/tasks/priority/:priority
 * @access  Private
 */
const getTasksByPriority = asyncHandler(async (req, res, next) => {
  const { priority } = req.params;

  if (!['low', 'medium', 'high'].includes(priority)) {
    return next(new AppError('Invalid priority. Must be low, medium, or high', 400));
  }

  const tasks = await Task.find({
    user: req.user._id,
    priority,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

module.exports = {
  getAllTasks,
  getTask,
  addTask,
  updateTask,
  toggleStatus,
  deleteTask,
  deleteCompletedTasks,
  getTaskStats,
  getTasksByPriority,
};