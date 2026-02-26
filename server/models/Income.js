const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    required: true,
    enum: ['weekly', 'fortnightly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  type: {
    type: String,
    enum: ['salary', 'freelance', 'passive', 'other'],
    default: 'salary'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Income', incomeSchema);