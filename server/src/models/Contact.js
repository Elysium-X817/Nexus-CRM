const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  jobTitle: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Lost'],
    default: 'New'
  },
  lastContactedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  avatarColor: {
    type: String,
    default: 'teal'
  }
}, {
  timestamps: true
});

contactSchema.index({ user: 1, name: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Contact', contactSchema);
