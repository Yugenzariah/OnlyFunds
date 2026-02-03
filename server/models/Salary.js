const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default', // For single user app
    unique: true
  },
  weeklySalary: {
    type: Number,
    default: 0,
    min: 0
  },
  monthlySalary: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Salary', salarySchema);