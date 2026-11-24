const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const Deal = require('../models/Deal');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/contacts
// @desc    Get all contacts for logged in user with search and status filter
router.get('/', async (req, res) => {
  try {
    const { search, status, sort = '-createdAt' } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
        { phone: searchRegex },
        { jobTitle: searchRegex }
      ];
    }

    const contacts = await Contact.find(query).sort(sort);
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: error.message || 'Error fetching contacts' });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get single contact with their activities and deals
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user._id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const [activities, deals, tasks] = await Promise.all([
      Activity.find({ contact: contact._id, user: req.user._id }).sort({ date: -1, createdAt: -1 }),
      Deal.find({ contact: contact._id, user: req.user._id }).sort({ createdAt: -1 }),
      Task.find({ contact: contact._id, user: req.user._id }).sort({ dueDate: 1 })
    ]);

    res.json({
      contact,
      activities,
      deals,
      tasks
    });
  } catch (error) {
    console.error('Get contact detail error:', error);
    res.status(500).json({ message: error.message || 'Error fetching contact details' });
  }
});

// @route   POST /api/contacts
// @desc    Create new contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, jobTitle, status, notes, lastContactedDate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const colors = ['teal', 'emerald', 'cyan', 'amber', 'rose', 'indigo', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const contact = await Contact.create({
      user: req.user._id,
      name,
      email,
      phone: phone || '',
      company: company || '',
      jobTitle: jobTitle || '',
      status: status || 'New',
      notes: notes || '',
      lastContactedDate: lastContactedDate || new Date(),
      avatarColor: randomColor
    });

    // Create an initial activity note
    await Activity.create({
      user: req.user._id,
      contact: contact._id,
      type: 'Note',
      title: 'Contact Created',
      description: `Contact ${name} was added to the CRM workspace.`,
      date: new Date()
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ message: error.message || 'Error creating contact' });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update contact
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user._id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const fields = ['name', 'email', 'phone', 'company', 'jobTitle', 'status', 'notes', 'lastContactedDate'];
    const oldStatus = contact.status;

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        contact[field] = req.body[field];
      }
    });

    const updatedContact = await contact.save();

    // If status changed, log an activity
    if (req.body.status && req.body.status !== oldStatus) {
      await Activity.create({
        user: req.user._id,
        contact: contact._id,
        type: 'Note',
        title: 'Status Updated',
        description: `Lead status changed from "${oldStatus}" to "${req.body.status}".`,
        date: new Date()
      });
    }

    res.json(updatedContact);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: error.message || 'Error updating contact' });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact and associated activities
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Clean up activities and unlink deals/tasks
    await Activity.deleteMany({ contact: req.params.id, user: req.user._id });
    await Deal.updateMany({ contact: req.params.id, user: req.user._id }, { $unset: { contact: 1 } });
    await Task.updateMany({ contact: req.params.id, user: req.user._id }, { $unset: { contact: 1 } });

    res.json({ message: 'Contact deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: error.message || 'Error deleting contact' });
  }
});

module.exports = router;
