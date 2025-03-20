import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Layout Components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import ChildProfile from './pages/ChildProfile';
import PillarDetails from './pages/PillarDetails';
import ActivityDetails from './pages/ActivityDetails';
import ChallengeCalendar from './pages/ChallengeCalendar';
import DailyChallenge from './pages/DailyChallenge';
import ProgressTracking from './pages/ProgressTracking';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      
      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/child/:childId" element={<ChildProfile />} />
        <Route path="/pillar/:pillarId" element={<PillarDetails />} />
        <Route path="/activity/:activityId" element={<ActivityDetails />} />
        <Route path="/challenges" element={<ChallengeCalendar />} />
        <Route path="/challenge/:challengeId" element={<DailyChallenge />} />
        <Route path="/progress/:childId" element={<ProgressTracking />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
