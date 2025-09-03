import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout components
import DashboardLayout from '../components/layouts/DashboardLayout';

// Auth components
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import PasswordReset from '../components/auth/PasswordReset';
import AccountSettings from '../components/auth/AccountSettings';

// Page components
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Gallery from '../pages/Gallery';
import GalleryDetail from '../pages/GalleryDetail';
import Subscription from '../pages/Subscription';
import Preview from '../pages/Preview';

// Protected route
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<PasswordReset />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/galleries" element={<Gallery />} />
          <Route path="/galleries/:galleryId" element={<GalleryDetail />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/preview" element={<Preview />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

