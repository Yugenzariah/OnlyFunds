import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const SubscriptionForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    billingCycle: 'monthly',
    lastPaymentDate: format(new Date(), 'yyyy-MM-dd'),
    category: 'Other'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        cost: initialData.cost,
        billingCycle: initialData.billingCycle,
        lastPaymentDate: format(new Date(initialData.lastPaymentDate), 'yyyy-MM-dd'),
        category: initialData.category || 'Other'
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cost: parseFloat(formData.cost)
    });
    
    // Reset form
    setFormData({
      name: '',
      cost: '',
      billingCycle: 'monthly',
      lastPaymentDate: format(new Date(), 'yyyy-MM-dd'),
      category: 'Other'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Service</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Spotify"
            required
          />
        </div>

        <div className="form-group">
          <label>Cost</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="11.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Billing Cycle</label>
          <select
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleChange}
          >
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-group">
          <label>Last Payment</label>
          <input
            type="date"
            name="lastPaymentDate"
            value={formData.lastPaymentDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button-primary">
          {initialData ? 'Update' : 'Add'} Subscription
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;