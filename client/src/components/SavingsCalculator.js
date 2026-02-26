import React, { useState } from 'react';
import { differenceInDays, differenceInWeeks, differenceInMonths, format } from 'date-fns';

const SavingsCalculator = ({ subscriptions, incomes, onClose }) => {
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState(null);

  const calculateSavings = () => {
    if (!targetDate) return;

    const today = new Date();
    const target = new Date(targetDate);
    
    if (target <= today) {
      alert('Please select a future date');
      return;
    }

    const days = differenceInDays(target, today);
    const weeks = differenceInWeeks(target, today);
    const months = differenceInMonths(target, today);

    // Calculate total monthly subscriptions
    const totalMonthlySubscriptions = subscriptions
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
        return total + monthlyCost;
      }, 0);

    // Calculate total monthly income from all streams
    const totalMonthlyIncome = incomes
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
        return total + monthlyIncome;
      }, 0);

    const totalIncome = totalMonthlyIncome * months;
    const totalSubscriptions = totalMonthlySubscriptions * months;
    const totalSavings = totalIncome - totalSubscriptions;

    setResult({
      targetDate: format(target, 'MMMM d, yyyy'),
      days,
      period: `${months} month${months !== 1 ? 's' : ''}`,
      totalIncome,
      totalSubscriptions,
      totalSavings
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Savings Calculator</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="calculator-content">
          <div className="form">
            <div className="form-group">
              <label>Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <button 
              className="button-primary" 
              onClick={calculateSavings}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Calculate Savings
            </button>
          </div>

          {result && (
            <div className="savings-result">
              <div className="result-header">
                <h3>By {result.targetDate}</h3>
                <p className="result-period">{result.period} ({result.days} days)</p>
              </div>

              <div className="result-breakdown">
                <div className="result-item">
                  <span className="result-label">Total Income</span>
                  <span className="result-value positive">${result.totalIncome.toFixed(2)}</span>
                </div>

                <div className="result-item">
                  <span className="result-label">Total Subscriptions</span>
                  <span className="result-value negative">-${result.totalSubscriptions.toFixed(2)}</span>
                </div>

                <div className="result-divider"></div>

                <div className="result-item total">
                  <span className="result-label">You'll Have Saved</span>
                  <span className="result-value">${result.totalSavings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;