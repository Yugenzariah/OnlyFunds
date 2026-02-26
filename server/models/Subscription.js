const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['weekly', 'fortnightly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  lastPaymentDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    default: 'Other'
  }
}, {
  timestamps: true
});

// Virtual field to calculate next payment date
subscriptionSchema.virtual('nextPaymentDate').get(function() {
  const lastDate = new Date(this.lastPaymentDate);
  const today = new Date();
  let nextDate = new Date(lastDate);
  
  // Keep adding billing cycles until we get a future date
  while (nextDate <= today) {
    switch(this.billingCycle) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'fortnightly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
  }
  
  return nextDate;
});

// Ensure virtual fields are included in JSON
subscriptionSchema.set('toJSON', { virtuals: true });
subscriptionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);