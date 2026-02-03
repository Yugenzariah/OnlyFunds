import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.css';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';
import Stats from './components/Stats';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/subscriptions');
      setSubscriptions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setLoading(false);
    }
  };

  const handleAddSubscription = async (subscriptionData) => {
    try {
      await axios.post('/api/subscriptions', subscriptionData);
      fetchSubscriptions();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const handleUpdateSubscription = async (id, subscriptionData) => {
    try {
      await axios.patch(`/api/subscriptions/${id}`, subscriptionData);
      fetchSubscriptions();
      setEditingSubscription(null);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Delete this subscription?')) {
      try {
        await axios.delete(`/api/subscriptions/${id}`);
        fetchSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
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
          <h1 className="title">Subscriptions</h1>
          <button 
            className="add-button"
            onClick={() => {
              setEditingSubscription(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? '×' : '+'}
          </button>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {showForm && (
            <SubscriptionForm
              onSubmit={editingSubscription 
                ? (data) => handleUpdateSubscription(editingSubscription._id, data)
                : handleAddSubscription
              }
              onCancel={handleCancelEdit}
              initialData={editingSubscription}
            />
          )}

          {!loading && subscriptions.length > 0 && (
            <Stats subscriptions={subscriptions} />
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