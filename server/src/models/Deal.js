const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  customerName: {
    type: String,
    trim: true,
    default: 'General Customer'
  },
  value: {
    type: Number,
    required: [true, 'Deal value is required'],
    default: 0
  },
  stage: {
    type: String,
    enum: ['Lead In', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Closed Won'],
    default: 'Lead In'
  },
  expectedCloseDate: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  notes: {
    type: String,
    default: ''
  },
  wonAt: {
    type: Date
  }
}, {
  timestamps: true
});

dealSchema.pre('save', function(next) {
  if (this.isModified('stage') && this.stage === 'Closed Won' && !this.wonAt) {
    this.wonAt = new Date();
  } else if (this.isModified('stage') && this.stage !== 'Closed Won') {
    this.wonAt = undefined;
  }
  next();
});

module.exports = mongoose.model('Deal', dealSchema);
