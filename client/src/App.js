import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/App.css";
import SubscriptionForm from "./components/SubscriptionForm";
import SubscriptionList from "./components/SubscriptionList";
import Stats from "./components/Stats";
import IncomeManager from "./components/IncomeManager";
import SavingsCalculator from "./components/SavingsCalculator";

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showIncomeManager, setShowIncomeManager] = useState(false);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
    fetchIncomes();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/api/subscriptions");
      setSubscriptions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setLoading(false);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await axios.get("/api/income");
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const handleAddSubscription = async (subscriptionData) => {
    try {
      await axios.post("/api/subscriptions", subscriptionData);
      fetchSubscriptions();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };

  const handleUpdateSubscription = async (id, subscriptionData) => {
    try {
      await axios.patch(`/api/subscriptions/${id}`, subscriptionData);
      fetchSubscriptions();
      setEditingSubscription(null);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm("Delete this subscription?")) {
      try {
        await axios.delete(`/api/subscriptions/${id}`);
        fetchSubscriptions();
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  const handleEditClick = (subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingSubscription(null);
    setShowForm(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">Yugens Hub</h1>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setShowSavingsCalculator(true)}
              title="Savings Calculator"
            >
              <span className="icon">📊</span>
              <span className="label">Calculate Savings</span>
            </button>
            <button
              className="icon-button"
              onClick={() => setShowIncomeManager(true)}
              title="Income Streams"
            >
              <span className="icon">$</span>
              <span className="label">Income</span>
            </button>
            <button
              className="icon-button"
              onClick={() => {
                setEditingSubscription(null);
                setShowForm(!showForm);
              }}
            >
              <span className="icon">{showForm ? "×" : "+"}</span>
              <span className="label">Add Expenses</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {showForm && (
            <SubscriptionForm
              onSubmit={
                editingSubscription
                  ? (data) =>
                      handleUpdateSubscription(editingSubscription._id, data)
                  : handleAddSubscription
              }
              onCancel={handleCancelEdit}
              initialData={editingSubscription}
            />
          )}

          {showIncomeManager && (
            <IncomeManager
              onClose={() => setShowIncomeManager(false)}
              onUpdate={fetchIncomes}
            />
          )}

          {showSavingsCalculator && (
            <SavingsCalculator
              subscriptions={subscriptions}
              incomes={incomes}
              onClose={() => setShowSavingsCalculator(false)}
            />
          )}

          {!loading && subscriptions.length > 0 && (
            <Stats subscriptions={subscriptions} incomes={incomes} />
          )}

          {loading ? (
            <div className="loading">Loading...</div>
          ) : subscriptions.length === 0 ? (
            <div className="empty-state">
              <p>No subscriptions yet</p>
              <button
                className="empty-button"
                onClick={() => setShowForm(true)}
              >
                Add your first subscription
              </button>
            </div>
          ) : (
            <SubscriptionList
              subscriptions={subscriptions}
              onEdit={handleEditClick}
              onDelete={handleDeleteSubscription}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;