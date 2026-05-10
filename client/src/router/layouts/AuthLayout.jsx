import { Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const APP_NAME = import.meta.env.VITE_APP_NAME

export default function AuthLayout() {
  const { t } = useTranslation()

  return (
    <div className="min-vh-100 d-flex flex-column auth-bg">
      <div className="text-center pt-5 pb-3">
        <Link to="/" className="text-decoration-none">
          <span className="fs-1">✈️</span>
          <h1 className="brand-name mt-1">{APP_NAME}</h1>
        </Link>
        <p className="text-muted small">{t('auth.tagline')}</p>
      </div>
      <div className="flex-grow-1 d-flex align-items-start justify-content-center px-3 pb-5">
        <div className="auth-card card shadow-sm border-0 p-4" style={{ maxWidth: 420, width: '100%' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
