import React from 'react';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';

const SubscriptionList = ({ subscriptions, onEdit, onDelete }) => {
  // Sort subscriptions by next payment date
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    return new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate);
  });

  const getPaymentStatus = (nextDate) => {
    const next = new Date(nextDate);
    const today = new Date();
    
    if (isPast(next) && !isToday(next)) {
      return { status: 'overdue', label: 'Overdue' };
    }
    if (isToday(next)) {
      return { status: 'today', label: 'Today' };
    }
    if (isTomorrow(next)) {
      return { status: 'tomorrow', label: 'Tomorrow' };
    }
    
    const daysUntil = differenceInDays(next, today);
    if (daysUntil <= 7) {
      return { status: 'soon', label: `${daysUntil}d` };
    }
    
    return { status: 'upcoming', label: format(next, 'MMM d') };
  };

  const formatCost = (cost) => {
    return `$${cost.toFixed(2)}`;
  };

  return (
    <div className="subscription-list">
      {sortedSubscriptions.map((sub) => {
        const { status, label } = getPaymentStatus(sub.nextPaymentDate);
        
        return (
          <div key={sub._id} className={`subscription-card ${status}`}>
            <div className="subscription-main">
              <div className="subscription-info">
                <h3 className="subscription-name">{sub.name}</h3>
                <p className="subscription-cost">{formatCost(sub.cost)}</p>
              </div>
              
              <div className="subscription-payment">
                <span className={`payment-badge ${status}`}>{label}</span>
                <p className="payment-date">
                  {format(new Date(sub.nextPaymentDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="subscription-actions">
              <button 
                className="action-button edit"
                onClick={() => onEdit(sub)}
                title="Edit"
              >
                ✎
              </button>
              <button 
                className="action-button delete"
                onClick={() => onDelete(sub._id)}
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionList;