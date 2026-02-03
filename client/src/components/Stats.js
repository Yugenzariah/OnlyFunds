import React from 'react';

const Stats = ({ subscriptions, salary }) => {
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
        if (cycle === 'weekly') return total + (monthlyCost / 4.33);
        
        return total;
      }, 0);
  };

  const weeklySubscriptions = calculateTotal('weekly');
  const monthlySubscriptions = calculateTotal('monthly');
  const yearlySubscriptions = calculateTotal('yearly');
  const activeCount = subscriptions.filter(sub => sub.isActive).length;

  const weeklySalary = salary?.weeklySalary || 0;
  const monthlySalary = salary?.monthlySalary || 0;

  // Calculate yearly income from monthly salary
  const yearlyIncome = monthlySalary * 12;

  const weeklyRemaining = weeklySalary - weeklySubscriptions;
  const monthlyRemaining = monthlySalary - monthlySubscriptions;
  const yearlyRemaining = yearlyIncome - yearlySubscriptions;

  const weeklyPercentage = weeklySalary > 0 
    ? ((weeklySubscriptions / weeklySalary) * 100).toFixed(1)
    : 0;
  const monthlyPercentage = monthlySalary > 0 
    ? ((monthlySubscriptions / monthlySalary) * 100).toFixed(1)
    : 0;
  const yearlyPercentage = yearlyIncome > 0 
    ? ((yearlySubscriptions / yearlyIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="stats-container">
      {/* Income Stats */}
      {(weeklySalary > 0 || monthlySalary > 0) && (
        <div className="stats-section">
          <h3 className="stats-section-title">Income</h3>
          <div className="stats">
            {weeklySalary > 0 && (
              <div className="stat-card">
                <p className="stat-label">Weekly Income</p>
                <p className="stat-value">${weeklySalary.toFixed(2)}</p>
                <p className="stat-sub">
                  ${weeklyRemaining.toFixed(2)} after subs ({weeklyPercentage}% spent)
                </p>
              </div>
            )}
            
            {monthlySalary > 0 && (
              <div className="stat-card">
                <p className="stat-label">Monthly Income</p>
                <p className="stat-value">${monthlySalary.toFixed(2)}</p>
                <p className="stat-sub">
                  ${monthlyRemaining.toFixed(2)} after subs ({monthlyPercentage}% spent)
                </p>
              </div>
            )}

            {monthlySalary > 0 && (
              <div className="stat-card">
                <p className="stat-label">Yearly Income</p>
                <p className="stat-value">${yearlyIncome.toFixed(2)}</p>
                <p className="stat-sub">
                  ${yearlyRemaining.toFixed(2)} after subs ({yearlyPercentage}% spent)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscription Stats */}
      <div className="stats-section">
        <h3 className="stats-section-title">Subscriptions</h3>
        <div className="stats">
          {weeklySalary > 0 && (
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