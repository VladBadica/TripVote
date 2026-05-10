import { NavLink, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function BottomNav() {
  const { tripId } = useParams()
  const { t } = useTranslation()

  if (!tripId) {
    return (
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <span className="bottom-nav-icon">🗺️</span>
          <span className="bottom-nav-label">{t('nav.trips')}</span>
        </NavLink>
      </nav>
    )
  }

  return (
    <nav className="bottom-nav">
      <NavLink to={`/trips/${tripId}`} end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">📋</span>
        <span className="bottom-nav-label">{t('nav.overview')}</span>
      </NavLink>
      <NavLink to={`/trips/${tripId}/vote`} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">🗳️</span>
        <span className="bottom-nav-label">{t('nav.votes')}</span>
      </NavLink>
      <NavLink to={`/trips/${tripId}/checklist`} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <span className="bottom-nav-icon">✅</span>
        <span className="bottom-nav-label">{t('nav.checklist')}</span>
      </NavLink>
    </nav>
  )
}
