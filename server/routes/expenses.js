const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses (with optional date filtering)
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { userId: 'default' };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expense summary by category
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let startDate, endDate;
    if (month && year) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }
    
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: 'default',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    const totalExpenses = expenses.reduce((sum, cat) => sum + cat.total, 0);
    
    res.json({
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
      categories: expenses,
      total: totalExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create expense
router.post('/', async (req, res) => {
  const expense = new Expense({
    userId: 'default',
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date || new Date()
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update expense
router.patch('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (req.body.description != null) expense.description = req.body.description;
    if (req.body.amount != null) expense.amount = req.body.amount;
    if (req.body.category != null) expense.category = req.body.category;
    if (req.body.date != null) expense.date = req.body.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;