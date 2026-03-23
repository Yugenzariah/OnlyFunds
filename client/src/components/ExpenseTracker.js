import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth } from "date-fns";

const ExpenseTracker = ({ onClose }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM"),
  );
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "other",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchExpenses = useCallback(async () => {
    try {
      const [year, month] = selectedMonth.split("-");
      const startDate = startOfMonth(new Date(year, month - 1));
      const endDate = endOfMonth(new Date(year, month - 1));

      const response = await axios.get("/api/expenses", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [selectedMonth]);

  const fetchSummary = useCallback(async () => {
    try {
      const [year, month] = selectedMonth.split("-");
      const response = await axios.get("/api/expenses/summary", {
        params: { month, year },
      });
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [fetchExpenses, fetchSummary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await axios.patch(`/api/expenses/${editingExpense._id}`, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
      } else {
        await axios.post("/api/expenses", {
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }

      fetchExpenses();
      fetchSummary();
      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: format(new Date(expense.date), "yyyy-MM-dd"),
    });
    setShowForm(true);

    // Scroll to form
    setTimeout(() => {
      const tracker = document.querySelector(".expense-tracker");
      const form = document.querySelector(".form");
      if (tracker && form) {
        tracker.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await axios.delete(`/api/expenses/${id}`);
        fetchExpenses();
        fetchSummary();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      category: "other",
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const categoryLabels = {
    groceries: "Groceries",
    dining: "Dining Out",
    snacks: "Snacks",
    gas: "Gas",
    transport: "Transport",
    entertainment: "Entertainment",
    shopping: "Shopping",
    health: "Health",
    utilities: "Utilities",
    other: "Other",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Expense Tracker</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="expense-tracker">
          {/* Month Selector */}
          <div className="month-selector">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-input"
            />
          </div>

          {/* Summary */}
          {summary && (
            <div className="expense-summary">
              <h3 className="summary-title">Monthly Summary</h3>
              <div className="summary-total">
                <span>Total Expenses</span>
                <span className="total-amount">
                  ${summary.total.toFixed(2)}
                </span>
              </div>

              <div className="category-breakdown">
                {summary.categories.map((cat) => (
                  <div key={cat._id} className="category-item">
                    <div className="category-info">
                      <span className="category-name">
                        {categoryLabels[cat._id]}
                      </span>
                      <span className="category-count">{cat.count} items</span>
                    </div>
                    <span className="category-amount">
                      ${cat.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Expense Button */}
          {!showForm && (
            <button
              className="button-primary"
              onClick={() => setShowForm(true)}
              style={{ marginTop: "2rem" }}
            >
              + Add Expense
            </button>
          )}

          {/* Expense Form */}
          {showForm && (
            <form
              className="form"
              onSubmit={handleSubmit}
              style={{ marginTop: "2rem" }}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Coffee at Starbucks"
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
                    placeholder="5.50"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  {editingExpense ? "Update" : "Add"} Expense
                </button>
              </div>
            </form>
          )}

          {/* Expense List */}
          <div className="expense-list" style={{ marginTop: "2rem" }}>
            <h3 className="list-title">Expenses</h3>
            {expenses.length === 0 ? (
              <p className="empty-text">No expenses for this month</p>
            ) : (
              expenses.map((expense) => (
                <div key={expense._id} className="expense-card">
                  <div className="expense-main">
                    <div className="expense-info">
                      <h4 className="expense-description">
                        {expense.description}
                      </h4>
                      <p className="expense-meta">
                        <span className="expense-category">
                          {categoryLabels[expense.category]}
                        </span>
                        <span className="expense-date">
                          {format(new Date(expense.date), "MMM d, yyyy")}
                        </span>
                      </p>
                    </div>
                    <span className="expense-amount">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="expense-actions">
                    <button
                      className="action-button edit"
                      onClick={() => handleEdit(expense)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(expense._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;