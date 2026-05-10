import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

const FEATURE_KEYS = [
  { icon: '🗳️', titleKey: 'landing.features.voteTogether_title', descKey: 'landing.features.voteTogether_desc' },
  { icon: '✅', titleKey: 'landing.features.sharedChecklist_title', descKey: 'landing.features.sharedChecklist_desc' },
  { icon: '⚡', titleKey: 'landing.features.liveActivity_title', descKey: 'landing.features.liveActivity_desc' },
  { icon: '🔗', titleKey: 'landing.features.easyInvite_title', descKey: 'landing.features.easyInvite_desc' }
]

export default function LandingPage() {
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="landing-page">
      <nav className="landing-nav d-flex align-items-center justify-content-between px-4 py-3">
        <span className="brand-name d-flex align-items-center gap-2">
          <span>✈️</span> TripVote
        </span>
        <div className="d-flex gap-2">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary-custom btn-sm">{t('nav.myTrips')}</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-secondary btn-sm">{t('nav.logIn')}</Link>
              <Link to="/register" className="btn btn-primary-custom btn-sm">{t('nav.signUpFree')}</Link>
            </>
          )}
        </div>
      </nav>

      <div className="landing-hero text-center px-4 py-5">
        <div className="hero-emoji mb-3">🏝️</div>
        <h1 className="hero-title fw-bold mb-3">
          {t('landing.heroTitle')}<br />
          <span className="text-primary">{t('landing.heroHighlight')}</span>
        </h1>
        <p className="hero-subtitle text-muted mb-4 mx-auto">
          {t('landing.heroSubtitle')}
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Link to="/register" className="btn btn-primary-custom btn-lg px-5">{t('landing.startPlanningFree')}</Link>
          <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">{t('nav.logIn')}</Link>
        </div>
        <p className="text-muted small mt-3">{t('landing.noCreditCard')}</p>
      </div>

      <div className="landing-features px-4 pb-5">
        <div className="row g-3 justify-content-center" style={{ maxWidth: 800, margin: '0 auto' }}>
          {FEATURE_KEYS.map(f => (
            <div key={f.titleKey} className="col-12 col-sm-6">
              <div className="feature-card card border-0 h-100 p-3">
                <div className="feature-icon mb-2">{f.icon}</div>
                <h6 className="fw-bold mb-1">{t(f.titleKey)}</h6>
                <p className="text-muted small mb-0">{t(f.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
