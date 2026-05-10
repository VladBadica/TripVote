import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import RequireAuth from './RequireAuth';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TripDetailPage from '../pages/TripDetailPage';
import VotingPage from '../pages/VotingPage';
import ChecklistPage from '../pages/ChecklistPage';
import TimelinePage from '../pages/TimelinePage';

export default function RouterViews() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/trips/:tripId/vote" element={<VotingPage />} />
        <Route path="/trips/:tripId/checklist" element={<ChecklistPage />} />
        <Route path="/trips/:tripId/timeline" element={<TimelinePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
