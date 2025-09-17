import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import AccidentReport from './components/accidents/AccidentReport';
import RecentAccidents from './components/accidents/RecentAccidents';
import AccidentDetail from './components/accidents/AccidentDetail';
import ReportsAnalytics from './components/analytics/ReportsAnalytics';
import SafetyResources from './components/resources/SafetyResources';
import Settings from './components/settings/Settings';
import LayoutNew from './components/layout/LayoutNew';
import AdminPanel from './components/admin/AdminPanel';
import axios from 'axios';
import NotFound from './components/misc/NotFound';
import LandingPage from './components/layout/LandingPage';


// Configure Axios base URL for production deployments (e.g., Vercel)
axios.defaults.baseURL = process.env.REACT_APP_API_URL;


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <Dashboard />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />
            <Route
              path="/accidents"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <RecentAccidents />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />
            <Route
              path="/accidents/:id"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <AccidentDetail />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-accident"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <AccidentReport />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports-analytics"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <ReportsAnalytics />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />
            <Route
              path="/safety-resources"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <SafetyResources />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <Settings />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <LayoutNew>
                    <AdminPanel />
                  </LayoutNew>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
