import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import BottomNav from './components/BottomNav.jsx';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import AssessmentHistory from './components/Dashboard/AssessmentHistory.jsx';
import AssessmentFlow from './components/Assessment/AssessmentFlow.jsx';
import ResultsView from './components/Results/ResultsView.jsx';
import GlossaryPage from './components/Glossary/GlossaryPage.jsx';
import UserProfile from './components/Profile/UserProfile.jsx';
import { api } from './utils/api.js';
import { ThemeProvider } from './utils/theme.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth session on startup
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('fitstart_token');
        if (token) {
          const res = await api.getCurrentUser();
          if (res.user) {
            setUser(res.user);
          } else {
            api.logout();
          }
        }
      } catch (err) {
        console.warn('Session verification failed, user must log in:', err.message);
        api.logout();
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="bg-surface-50 dark:bg-surface-950 min-h-screen font-sans text-surface-900 dark:text-surface-100 antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200">
          {/* Persistent Nav */}
          <Nav user={user} onLogout={() => setUser(null)} />

          {/* Application Routes */}
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={setUser} />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/dashboard" replace /> : <Signup onLoginSuccess={setUser} />}
            />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/assessment" element={<AssessmentFlow user={user} />} />
            <Route path="/results/:profileId" element={<ResultsView user={user} onAuthSuccess={setUser} />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute user={user} loading={loading} />}>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/history" element={<AssessmentHistory />} />
              <Route
                path="/profile"
                element={<UserProfile user={user} onUserUpdated={setUser} onLogout={() => setUser(null)} />}
              />
            </Route>

            {/* Root Redirect */}
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/assessment" replace />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/assessment"} replace />} />
          </Routes>

          {/* Modern Mobile Bottom Navigation Dock */}
          <BottomNav user={user} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
