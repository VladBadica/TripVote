import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TripDetailPage from './pages/TripDetailPage'
import VotingPage from './pages/VotingPage'
import ChecklistPage from './pages/ChecklistPage'
import TimelinePage from './pages/TimelinePage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
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
