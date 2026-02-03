const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');

// Get salary info
router.get('/', async (req, res) => {
  try {
    let salary = await Salary.findOne({ userId: 'default' });
    
    // If no salary record exists, create one with defaults
    if (!salary) {
      salary = await Salary.create({
        userId: 'default',
        weeklySalary: 0,
        monthlySalary: 0
      });
    }
    
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update salary info
router.patch('/', async (req, res) => {
  try {
    let salary = await Salary.findOne({ userId: 'default' });
    
    if (!salary) {
      salary = new Salary({ userId: 'default' });
    }
    
    if (req.body.weeklySalary != null) {
      salary.weeklySalary = req.body.weeklySalary;
    }
    if (req.body.monthlySalary != null) {
      salary.monthlySalary = req.body.monthlySalary;
    }
    
    const updatedSalary = await salary.save();
    res.json(updatedSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;