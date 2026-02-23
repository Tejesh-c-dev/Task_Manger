const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Task text is required'],
      trim: true,
      minlength: [1, 'Task text cannot be empty'],
      maxlength: [500, 'Task text cannot exceed 500 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
      default: 'general',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for user queries with sorting
TaskSchema.index({ user: 1, createdAt: -1 });
TaskSchema.index({ user: 1, completed: 1 });
TaskSchema.index({ user: 1, priority: 1 });
TaskSchema.index({ user: 1, dueDate: 1 });

// Set completedAt when task is marked complete
TaskSchema.pre('save', function () {
  if (this.isModified('completed')) {
    this.completedAt = this.completed ? new Date() : null;
  }
});

// Virtual to check if task is overdue
TaskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;