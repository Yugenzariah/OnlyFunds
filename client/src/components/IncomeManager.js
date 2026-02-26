import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomeManager = ({ onClose, onUpdate }) => {
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    type: 'salary'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get('/api/income');
      setIncomes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncome) {
        await axios.patch(`/api/income/${editingIncome._id}`, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      } else {
        await axios.post('/api/income', {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      }
      
      fetchIncomes();
      onUpdate();
      resetForm();
    } catch (error) {
      console.error('Error saving income:', error);
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      name: income.name,
      amount: income.amount,
      frequency: income.frequency,
      type: income.type
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this income source?')) {
      try {
        await axios.delete(`/api/income/${id}`);
        fetchIncomes();
        onUpdate();
      } catch (error) {
        console.error('Error deleting income:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      frequency: 'monthly',
      type: 'salary'
    });
    setEditingIncome(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="modal-overlay"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Income Streams</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="income-manager">
          {!showForm && (
            <button 
              className="button-primary"
              onClick={() => setShowForm(true)}
              style={{ marginBottom: '1.5rem' }}
            >
              + Add Income Source
            </button>
          )}

          {showForm && (
            <form className="form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full-time Job"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="2000.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="salary">Salary</option>
                    <option value="freelance">Freelance</option>
                    <option value="passive">Passive Income</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="button-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  {editingIncome ? 'Update' : 'Add'} Income
                </button>
              </div>
            </form>
          )}

          {incomes.length === 0 ? (
            <div className="empty-state">
              <p>No income sources yet</p>
            </div>
          ) : (
            <div className="income-list">
              {incomes.map((income) => (
                <div key={income._id} className="income-card">
                  <div className="income-main">
                    <div className="income-info">
                      <h3 className="income-name">{income.name}</h3>
                      <p className="income-meta">
                        <span className="income-type">{income.type}</span>
                        <span className="income-frequency">{income.frequency}</span>
                      </p>
                    </div>
                    
                    <div className="income-amount">
                      <p className="income-value">${income.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="income-actions">
                    <button 
                      className="action-button edit"
                      onClick={() => handleEdit(income)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDelete(income._id)}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeManager;