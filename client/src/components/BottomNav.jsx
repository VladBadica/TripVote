import { NavLink, useParams } from 'react-router-dom'

export default function BottomNav() {
  const { tripId } = useParams()

  if (!tripId) {
    return (
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="bottom-nav-icon">🗺️</span>
          <span className="bottom-nav-label">Trips</span>
        </NavLink>
      </nav>
    )
  }

  return (
    <nav className="bottom-nav">
      <NavLink to={`/trips/${tripId}`} end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">📋</span>
        <span className="bottom-nav-label">Overview</span>
      </NavLink>
      <NavLink to={`/trips/${tripId}/vote`} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🗳️</span>
        <span className="bottom-nav-label">Votes</span>
      </NavLink>
      <NavLink to={`/trips/${tripId}/checklist`} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">✅</span>
        <span className="bottom-nav-label">Checklist</span>
      </NavLink>
      <NavLink to={`/trips/${tripId}/timeline`} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">⚡</span>
        <span className="bottom-nav-label">Activity</span>
      </NavLink>
    </nav>
  )
}
