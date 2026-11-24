const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/activities/contact/:contactId
// @desc    Get activity timeline for a contact
router.get('/contact/:contactId', async (req, res) => {
  try {
    const activities = await Activity.find({
      contact: req.params.contactId,
      user: req.user._id
    }).sort({ date: -1, createdAt: -1 });

    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: error.message || 'Error fetching activities' });
  }
});

// @route   POST /api/activities
// @desc    Add a new activity (Call, Meeting, Email, Note) and update contact's lastContactedDate
router.post('/', async (req, res) => {
  try {
    const { contactId, type, title, description, date } = req.body;

    if (!contactId || !title) {
      return res.status(400).json({ message: 'Contact ID and title are required' });
    }

    const contact = await Contact.findOne({ _id: contactId, user: req.user._id });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const activityDate = date ? new Date(date) : new Date();

    const activity = await Activity.create({
      user: req.user._id,
      contact: contactId,
      type: type || 'Note',
      title,
      description: description || '',
      date: activityDate
    });

    // Update the contact's lastContactedDate
    contact.lastContactedDate = activityDate;
    if (contact.status === 'New') {
      contact.status = 'Contacted';
    }
    await contact.save();

    res.status(201).json({ activity, contact });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: error.message || 'Error creating activity' });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete an activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: error.message || 'Error deleting activity' });
  }
});

module.exports = router;
