const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// Get all income streams
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find({ userId: 'default' }).sort({ createdAt: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single income
router.get('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create income
router.post('/', async (req, res) => {
  const income = new Income({
    userId: 'default',
    name: req.body.name,
    amount: req.body.amount,
    frequency: req.body.frequency,
    type: req.body.type || 'salary',
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });

  try {
    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update income
router.patch('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (req.body.name != null) income.name = req.body.name;
    if (req.body.amount != null) income.amount = req.body.amount;
    if (req.body.frequency != null) income.frequency = req.body.frequency;
    if (req.body.type != null) income.type = req.body.type;
    if (req.body.isActive != null) income.isActive = req.body.isActive;

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete income
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    await income.deleteOne();
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;