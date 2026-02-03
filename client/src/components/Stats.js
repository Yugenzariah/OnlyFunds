import React from 'react';

const Stats = ({ subscriptions }) => {
  const calculateTotal = (cycle) => {
    return subscriptions
      .filter(sub => sub.isActive)
      .reduce((total, sub) => {
        let monthlyCost = 0;
        
        switch(sub.billingCycle) {
          case 'weekly':
            monthlyCost = sub.cost * 4.33; // Average weeks per month
            break;
          case 'monthly':
            monthlyCost = sub.cost;
            break;
          case 'yearly':
            monthlyCost = sub.cost / 12;
            break;
          default:
            monthlyCost = 0;
        }
        
        if (cycle === 'monthly') return total + monthlyCost;
        if (cycle === 'yearly') return total + (monthlyCost * 12);
        
        return total;
      }, 0);
  };

  const monthlyTotal = calculateTotal('monthly');
  const yearlyTotal = calculateTotal('yearly');
  const activeCount = subscriptions.filter(sub => sub.isActive).length;

  return (
    <div className="stats">
      <div className="stat-card">
        <p className="stat-label">Monthly</p>
        <p className="stat-value">${monthlyTotal.toFixed(2)}</p>
      </div>
      
      <div className="stat-card">
        <p className="stat-label">Yearly</p>
        <p className="stat-value">${yearlyTotal.toFixed(2)}</p>
      </div>
      
      <div className="stat-card">
        <p className="stat-label">Active</p>
        <p className="stat-value">{activeCount}</p>
      </div>
    </div>
  );
};

export default Stats;
