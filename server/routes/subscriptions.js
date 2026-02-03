const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ lastPaymentDate: 1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single subscription
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create subscription
router.post('/', async (req, res) => {
  const subscription = new Subscription({
    name: req.body.name,
    cost: req.body.cost,
    billingCycle: req.body.billingCycle,
    lastPaymentDate: req.body.lastPaymentDate,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    category: req.body.category || 'Other'
  });

  try {
    const newSubscription = await subscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update subscription
router.patch('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (req.body.name != null) subscription.name = req.body.name;
    if (req.body.cost != null) subscription.cost = req.body.cost;
    if (req.body.billingCycle != null) subscription.billingCycle = req.body.billingCycle;
    if (req.body.lastPaymentDate != null) subscription.lastPaymentDate = req.body.lastPaymentDate;
    if (req.body.isActive != null) subscription.isActive = req.body.isActive;
    if (req.body.category != null) subscription.category = req.body.category;

    const updatedSubscription = await subscription.save();
    res.json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    await subscription.deleteOne();
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
