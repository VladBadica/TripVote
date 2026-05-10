import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import { mockMembers } from '../mock/mockData'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TripDetailPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { getTripById, getPollsByTrip, getChecklistByTrip } = useTrips()

  const trip = getTripById(tripId)
  if (!trip) {
    return (
      <div className="page-container text-center py-5">
        <p className="text-muted">Trip not found.</p>
        <button className="btn btn-primary-custom" onClick={() => navigate('/dashboard')}>Back to dashboard</button>
      </div>
    )
  }

  const polls = getPollsByTrip(tripId)
  const checklist = getChecklistByTrip(tripId)
  const done = checklist.filter(c => c.done).length

  function copyInvite() {
    navigator.clipboard.writeText(trip.inviteCode).then(() => alert(`Invite code copied: ${trip.inviteCode}`))
  }

  return (
    <div className="page-container pb-nav">
      <div className="trip-detail-header mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <button className="btn btn-link p-0 text-muted" onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
        <div className="d-flex align-items-start gap-3">
          <div className="trip-emoji-badge lg">{trip.coverEmoji}</div>
          <div>
            <h4 className="fw-bold mb-1">{trip.name}</h4>
            <p className="text-muted mb-1 small">📍 {trip.destination}</p>
            <p className="text-muted mb-0 small">
              📅 {formatDate(trip.startDate)}
              {trip.endDate && ` → ${formatDate(trip.endDate)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Invite banner */}
      <div className="invite-banner card border-0 mb-4 p-3 d-flex flex-row align-items-center justify-content-between gap-2">
        <div>
          <p className="fw-semibold small mb-0">Invite friends</p>
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Code: <strong>{trip.inviteCode}</strong></p>
        </div>
        <button className="btn btn-sm btn-outline-primary flex-shrink-0" onClick={copyInvite}>
          Copy code
        </button>
      </div>

      {/* Stats row */}
      <div className="row g-2 mb-4">
        <div className="col-4">
          <Link to={`/trips/${tripId}/vote`} className="stat-card card border-0 text-decoration-none text-center p-3 h-100">
            <div className="stat-icon">🗳️</div>
            <div className="stat-value">{polls.length}</div>
            <div className="stat-label">Polls</div>
          </Link>
        </div>
        <div className="col-4">
          <Link to={`/trips/${tripId}/checklist`} className="stat-card card border-0 text-decoration-none text-center p-3 h-100">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{done}/{checklist.length}</div>
            <div className="stat-label">Tasks done</div>
          </Link>
        </div>
        <div className="col-4">
          <div className="stat-card card border-0 text-center p-3 h-100">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{trip.memberCount}</div>
            <div className="stat-label">Members</div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="section-block card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <p className="fw-semibold small mb-3">Members</p>
          <div className="d-flex flex-column gap-2">
            {mockMembers.map(m => (
              <div key={m.id} className="d-flex align-items-center gap-3">
                <div className="member-avatar">{m.avatar}</div>
                <div>
                  <p className="mb-0 small fw-medium">{m.name}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.72rem' }}>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="d-flex flex-column gap-2">
        <Link to={`/trips/${tripId}/vote`} className="quick-link card border-0 shadow-sm text-decoration-none p-3 d-flex flex-row align-items-center justify-content-between">
          <span className="fw-medium small">🗳️ View polls & votes</span>
          <span className="text-muted">›</span>
        </Link>
        <Link to={`/trips/${tripId}/checklist`} className="quick-link card border-0 shadow-sm text-decoration-none p-3 d-flex flex-row align-items-center justify-content-between">
          <span className="fw-medium small">✅ Open checklist</span>
          <span className="text-muted">›</span>
        </Link>
        <Link to={`/trips/${tripId}/timeline`} className="quick-link card border-0 shadow-sm text-decoration-none p-3 d-flex flex-row align-items-center justify-content-between">
          <span className="fw-medium small">⚡ Activity timeline</span>
          <span className="text-muted">›</span>
        </Link>
      </div>
    </div>
  )
}
