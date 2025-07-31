import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage.jsx';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import './styles/main.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading CoachGG...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="app">
        <Dashboard />
      </div>
    );
  }

  // If user wants to authenticate, show auth form
  if (showAuth) {
    return (
      <div className="app">
        <AuthForm onBack={() => setShowAuth(false)} />
      </div>
    );
  }

  // Otherwise show landing page
  return (
    <div className="app">
      <LandingPage onGetStarted={() => setShowAuth(true)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
