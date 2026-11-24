const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  customerName: {
    type: String,
    trim: true,
    default: ''
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  taskType: {
    type: String,
    enum: ['Follow-up', 'Call', 'Meeting', 'Email', 'Review'],
    default: 'Follow-up'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
