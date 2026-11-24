const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for user with filter
router.get('/', async (req, res) => {
  try {
    const { status, filter } = req.query;
    const query = { user: req.user._id };

    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (filter === 'today') {
      query.dueDate = { $gte: startOfToday, $lte: endOfToday };
    } else if (filter === 'upcoming') {
      query.dueDate = { $gt: endOfToday };
      query.completed = false;
    } else if (filter === 'overdue') {
      query.dueDate = { $lt: startOfToday };
      query.completed = false;
    }

    const tasks = await Task.find(query)
      .populate('contact', 'name email company phone')
      .sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: error.message || 'Error fetching tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
router.post('/', async (req, res) => {
  try {
    const { title, contact: contactId, customerName, dueDate, priority, taskType, notes } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Task title and due date are required' });
    }

    let resolvedCustomerName = customerName || '';
    if (contactId) {
      const contactObj = await Contact.findOne({ _id: contactId, user: req.user._id });
      if (contactObj) {
        resolvedCustomerName = contactObj.name;
      }
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      contact: contactId || undefined,
      customerName: resolvedCustomerName,
      dueDate: new Date(dueDate),
      priority: priority || 'Medium',
      taskType: taskType || 'Follow-up',
      notes: notes || '',
      completed: false
    });

    if (contactId) {
      await Activity.create({
        user: req.user._id,
        contact: contactId,
        type: 'Note',
        title: `Task Created: ${taskType}`,
        description: `Follow-up task "${title}" scheduled for ${new Date(dueDate).toLocaleDateString()}.`,
        date: new Date()
      });
    }

    const populated = await Task.findById(task._id).populate('contact', 'name email company phone');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: error.message || 'Error creating task' });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completed status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    const updated = await task.save();

    if (task.contact && task.completed) {
      await Activity.create({
        user: req.user._id,
        contact: task.contact,
        type: 'Note',
        title: 'Task Completed',
        description: `Completed task: "${task.title}".`,
        date: new Date()
      });
    }

    const populated = await Task.findById(updated._id).populate('contact', 'name email company phone');
    res.json(populated);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ message: error.message || 'Error updating task status' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task details
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const fields = ['title', 'contact', 'customerName', 'dueDate', 'priority', 'taskType', 'notes', 'completed'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    if (req.body.contact) {
      const contactObj = await Contact.findOne({ _id: req.body.contact, user: req.user._id });
      if (contactObj) {
        task.customerName = contactObj.name;
      }
    }

    const updated = await task.save();
    const populated = await Task.findById(updated._id).populate('contact', 'name email company phone');
    res.json(populated);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: error.message || 'Error updating task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: error.message || 'Error deleting task' });
  }
});

module.exports = router;
