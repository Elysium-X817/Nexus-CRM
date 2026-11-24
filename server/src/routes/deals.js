const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   GET /api/deals
// @desc    Get all deals for user
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find({ user: req.user._id })
      .populate('contact', 'name email company phone')
      .sort({ createdAt: -1 });
    res.json(deals);
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ message: error.message || 'Error fetching deals' });
  }
});

// @route   POST /api/deals
// @desc    Create new deal
router.post('/', async (req, res) => {
  try {
    const { title, contact: contactId, customerName, value, stage, expectedCloseDate, priority, notes } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Deal title is required' });
    }

    let resolvedCustomerName = customerName;
    if (contactId) {
      const contactObj = await Contact.findOne({ _id: contactId, user: req.user._id });
      if (contactObj) {
        resolvedCustomerName = contactObj.name;
      }
    }

    const isWon = stage === 'Closed Won';
    const deal = await Deal.create({
      user: req.user._id,
      title,
      contact: contactId || undefined,
      customerName: resolvedCustomerName || 'General Customer',
      value: Number(value) || 0,
      stage: stage || 'Lead In',
      expectedCloseDate: expectedCloseDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      priority: priority || 'Medium',
      notes: notes || '',
      wonAt: isWon ? new Date() : undefined
    });

    if (contactId) {
      await Activity.create({
        user: req.user._id,
        contact: contactId,
        type: 'Note',
        title: 'Deal Created',
        description: `New deal "${title}" created for $${Number(value || 0).toLocaleString()} in stage "${stage || 'Lead In'}".`,
        date: new Date()
      });
    }

    const populatedDeal = await Deal.findById(deal._id).populate('contact', 'name email company phone');
    res.status(201).json(populatedDeal);
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: error.message || 'Error creating deal' });
  }
});

// @route   PATCH /api/deals/:id/stage
// @desc    Update deal stage (for drag and drop on Kanban board)
router.patch('/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    const allowedStages = ['Lead In', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Closed Won'];

    if (!allowedStages.includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage value' });
    }

    const deal = await Deal.findOne({ _id: req.params.id, user: req.user._id });
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const oldStage = deal.stage;
    deal.stage = stage;
    if (stage === 'Closed Won') {
      deal.wonAt = new Date();
    } else {
      deal.wonAt = undefined;
    }

    const updatedDeal = await deal.save();
    const populated = await Deal.findById(updatedDeal._id).populate('contact', 'name email company phone');

    // If deal has an associated contact, record an activity timeline entry
    if (deal.contact && oldStage !== stage) {
      await Activity.create({
        user: req.user._id,
        contact: deal.contact,
        type: 'Note',
        title: stage === 'Closed Won' ? 'Deal Won!' : 'Deal Stage Advanced',
        description: `Deal "${deal.title}" moved from "${oldStage}" to "${stage}" (Value: $${deal.value.toLocaleString()}).`,
        date: new Date()
      });
    }

    res.json(populated);
  } catch (error) {
    console.error('Update deal stage error:', error);
    res.status(500).json({ message: error.message || 'Error updating deal stage' });
  }
});

// @route   PUT /api/deals/:id
// @desc    Update full deal
router.put('/:id', async (req, res) => {
  try {
    const deal = await Deal.findOne({ _id: req.params.id, user: req.user._id });
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const fields = ['title', 'customerName', 'contact', 'value', 'stage', 'expectedCloseDate', 'priority', 'notes'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        deal[field] = req.body[field];
      }
    });

    if (req.body.stage === 'Closed Won' && !deal.wonAt) {
      deal.wonAt = new Date();
    } else if (req.body.stage && req.body.stage !== 'Closed Won') {
      deal.wonAt = undefined;
    }

    // Update customerName from contact if contact provided
    if (req.body.contact) {
      const contactObj = await Contact.findOne({ _id: req.body.contact, user: req.user._id });
      if (contactObj) {
        deal.customerName = contactObj.name;
      }
    }

    const updated = await deal.save();
    const populated = await Deal.findById(updated._id).populate('contact', 'name email company phone');
    res.json(populated);
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ message: error.message || 'Error updating deal' });
  }
});

// @route   DELETE /api/deals/:id
// @desc    Delete deal
router.delete('/:id', async (req, res) => {
  try {
    const deal = await Deal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.json({ message: 'Deal deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ message: error.message || 'Error deleting deal' });
  }
});

module.exports = router;
