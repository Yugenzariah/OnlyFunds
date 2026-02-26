import React from 'react';

const Stats = ({ subscriptions, incomes }) => {
  const calculateTotal = (cycle) => {
    return subscriptions
      .filter(sub => sub.isActive)
      .reduce((total, sub) => {
        let monthlyCost = 0;
        
        switch(sub.billingCycle) {
          case 'weekly':
            monthlyCost = sub.cost * 4.33;
            break;
          case 'fortnightly':
            monthlyCost = sub.cost * 2.165;
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
        if (cycle === 'weekly') return total + (monthlyCost / 4.33);
        
        return total;
      }, 0);
  };

  // Calculate total income from all streams
  const calculateTotalIncome = (cycle) => {
    if (!incomes || incomes.length === 0) return 0;

    return incomes
      .filter(inc => inc.isActive)
      .reduce((total, inc) => {
        let monthlyIncome = 0;
        
        switch(inc.frequency) {
          case 'weekly':
            monthlyIncome = inc.amount * 4.33;
            break;
          case 'fortnightly':
            monthlyIncome = inc.amount * 2.165;
            break;
          case 'monthly':
            monthlyIncome = inc.amount;
            break;
          case 'yearly':
            monthlyIncome = inc.amount / 12;
            break;
          default:
            monthlyIncome = 0;
        }
        
        if (cycle === 'monthly') return total + monthlyIncome;
        if (cycle === 'yearly') return total + (monthlyIncome * 12);
        if (cycle === 'weekly') return total + (monthlyIncome / 4.33);
        
        return total;
      }, 0);
  };

  const weeklySubscriptions = calculateTotal('weekly');
  const monthlySubscriptions = calculateTotal('monthly');
  const yearlySubscriptions = calculateTotal('yearly');
  const activeCount = subscriptions.filter(sub => sub.isActive).length;

  const weeklyIncome = calculateTotalIncome('weekly');
  const monthlyIncome = calculateTotalIncome('monthly');
  const yearlyIncome = calculateTotalIncome('yearly');

  const weeklyRemaining = weeklyIncome - weeklySubscriptions;
  const monthlyRemaining = monthlyIncome - monthlySubscriptions;
  const yearlyRemaining = yearlyIncome - yearlySubscriptions;

  const weeklyPercentage = weeklyIncome > 0 
    ? ((weeklySubscriptions / weeklyIncome) * 100).toFixed(1)
    : 0;
  const monthlyPercentage = monthlyIncome > 0 
    ? ((monthlySubscriptions / monthlyIncome) * 100).toFixed(1)
    : 0;
  const yearlyPercentage = yearlyIncome > 0 
    ? ((yearlySubscriptions / yearlyIncome) * 100).toFixed(1)
    : 0;

  const hasIncome = incomes && incomes.length > 0;

  return (
    <div className="stats-container">
      {/* Income Stats */}
      {hasIncome && (
        <div className="stats-section">
          <h3 className="stats-section-title">Income</h3>
          <div className="stats">
            {weeklyIncome > 0 && (
              <div className="stat-card">
                <p className="stat-label">Weekly Income</p>
                <p className="stat-value">${weeklyIncome.toFixed(2)}</p>
                <p className="stat-sub">
                  ${weeklyRemaining.toFixed(2)} after subs ({weeklyPercentage}% spent)
                </p>
              </div>
            )}
            
            <div className="stat-card">
              <p className="stat-label">Monthly Income</p>
              <p className="stat-value">${monthlyIncome.toFixed(2)}</p>
              <p className="stat-sub">
                ${monthlyRemaining.toFixed(2)} after subs ({monthlyPercentage}% spent)
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Yearly Income</p>
              <p className="stat-value">${yearlyIncome.toFixed(2)}</p>
              <p className="stat-sub">
                ${yearlyRemaining.toFixed(2)} after subs ({yearlyPercentage}% spent)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Stats */}
      <div className="stats-section">
        <h3 className="stats-section-title">Subscriptions</h3>
        <div className="stats">
          {weeklyIncome > 0 && (
            <div className="stat-card">
              <p className="stat-label">Weekly</p>
              <p className="stat-value">${weeklySubscriptions.toFixed(2)}</p>
            </div>
          )}
          
          <div className="stat-card">
            <p className="stat-label">Monthly</p>
            <p className="stat-value">${monthlySubscriptions.toFixed(2)}</p>
          </div>
          
          <div className="stat-card">
            <p className="stat-label">Yearly</p>
            <p className="stat-value">${yearlySubscriptions.toFixed(2)}</p>
          </div>
          
          <div className="stat-card">
            <p className="stat-label">Active</p>
            <p className="stat-value">{activeCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;