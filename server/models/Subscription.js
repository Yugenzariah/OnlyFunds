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
    enum: ['weekly', 'monthly', 'yearly'],
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
  const nextDate = new Date(lastDate);
  
  switch(this.billingCycle) {
    case 'weekly':
      nextDate.setDate(lastDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(lastDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(lastDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
});

// Ensure virtual fields are included in JSON
subscriptionSchema.set('toJSON', { virtuals: true });
subscriptionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
