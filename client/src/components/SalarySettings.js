import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalarySettings = ({ onClose, onUpdate }) => {
  const [salary, setSalary] = useState({
    weeklySalary: 0,
    monthlySalary: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalary();
  }, []);

  const fetchSalary = async () => {
    try {
      const response = await axios.get('/api/salary');
      setSalary({
        weeklySalary: response.data.weeklySalary || 0,
        monthlySalary: response.data.monthlySalary || 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching salary:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch('/api/salary', {
        weeklySalary: parseFloat(salary.weeklySalary) || 0,
        monthlySalary: parseFloat(salary.monthlySalary) || 0
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  const handleChange = (e) => {
    setSalary({
      ...salary,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="modal-overlay"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Income Settings</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Weekly Salary</label>
              <input
                type="number"
                name="weeklySalary"
                value={salary.weeklySalary}
                onChange={handleChange}
                placeholder="500.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Monthly Salary</label>
              <input
                type="number"
                name="monthlySalary"
                value={salary.monthlySalary}
                onChange={handleChange}
                placeholder="2000.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button-primary">
              Save Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalarySettings;