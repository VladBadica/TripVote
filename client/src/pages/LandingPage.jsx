import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '🗳️', title: 'Vote together', desc: 'Create polls for destinations, activities, and transport. Everyone has a say.' },
  { icon: '✅', title: 'Shared checklist', desc: 'Assign tasks, set deadlines, and track what\'s done as a team.' },
  { icon: '⚡', title: 'Live activity feed', desc: 'Stay in the loop with a real-time timeline of every group decision.' },
  { icon: '🔗', title: 'Easy invite', desc: 'Share a link — friends join instantly, no signup friction.' }
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="landing-page">
      <nav className="landing-nav d-flex align-items-center justify-content-between px-4 py-3">
        <span className="brand-name d-flex align-items-center gap-2">
          <span>✈️</span> TripVote
        </span>
        <div className="d-flex gap-2">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary-custom btn-sm">My trips</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-secondary btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary-custom btn-sm">Sign up free</Link>
            </>
          )}
        </div>
      </nav>

      <div className="landing-hero text-center px-4 py-5">
        <div className="hero-emoji mb-3">🏝️</div>
        <h1 className="hero-title fw-bold mb-3">Group trips made<br /><span className="text-primary">ridiculously easy</span></h1>
        <p className="hero-subtitle text-muted mb-4 mx-auto">
          Stop the endless group chat debates. TripVote lets your crew vote on destinations,
          activities, and transport — then tracks everything in one place.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Link to="/register" className="btn btn-primary-custom btn-lg px-5">Start planning free</Link>
          <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">Log in</Link>
        </div>
        <p className="text-muted small mt-3">No credit card required</p>
      </div>

      <div className="landing-features px-4 pb-5">
        <div className="row g-3 justify-content-center" style={{ maxWidth: 800, margin: '0 auto' }}>
          {FEATURES.map(f => (
            <div key={f.title} className="col-12 col-sm-6">
              <div className="feature-card card border-0 h-100 p-3">
                <div className="feature-icon mb-2">{f.icon}</div>
                <h6 className="fw-bold mb-1">{f.title}</h6>
                <p className="text-muted small mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-5 text-muted small">
        &copy; {new Date().getFullYear()} TripVote
      </div>
    </div>
  )
}
