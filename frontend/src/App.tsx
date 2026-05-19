import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LeadProvider } from './context/LeadContext';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <LeadProvider>
              <Routes>
                {/* Public Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Dashboard Routes */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* Fallback Catch-all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </LeadProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
