const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['groceries', 'dining', 'snacks', 'gas', 'transport', 'entertainment', 'shopping', 'health', 'utilities', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);