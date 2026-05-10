import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column auth-bg">
      <div className="text-center pt-5 pb-3">
        <Link to="/" className="text-decoration-none">
          <span className="fs-1">✈️</span>
          <h1 className="brand-name mt-1">TripVote</h1>
        </Link>
        <p className="text-muted small">Plan trips together, vote on everything.</p>
      </div>
      <div className="flex-grow-1 d-flex align-items-start justify-content-center px-3 pb-5">
        <div className="auth-card card shadow-sm border-0 p-4" style={{ maxWidth: 420, width: '100%' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
