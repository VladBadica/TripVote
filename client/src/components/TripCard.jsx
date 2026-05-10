import { useNavigate } from 'react-router-dom'

const STATUS_BADGE = {
  planning: { label: 'Planning', cls: 'bg-warning-subtle text-warning-emphasis' },
  confirmed: { label: 'Confirmed', cls: 'bg-success-subtle text-success-emphasis' },
  completed: { label: 'Completed', cls: 'bg-secondary-subtle text-secondary-emphasis' }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TripCard({ trip }) {
  const navigate = useNavigate()
  const badge = STATUS_BADGE[trip.status] ?? STATUS_BADGE.planning

  return (
    <div
      className="trip-card card border-0 shadow-sm mb-3"
      onClick={() => navigate(`/trips/${trip.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/trips/${trip.id}`)}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-start gap-3">
          <div className="trip-emoji-badge">{trip.coverEmoji}</div>
          <div className="flex-grow-1 min-w-0">
            <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
              <h6 className="card-title mb-0 fw-bold text-truncate">{trip.name}</h6>
              <span className={`badge rounded-pill ${badge.cls} flex-shrink-0`}>{badge.label}</span>
            </div>
            <p className="text-muted small mb-2 text-truncate">📍 {trip.destination}</p>
            <div className="d-flex align-items-center gap-3 text-muted small">
              <span>📅 {formatDate(trip.startDate)}</span>
              <span>👥 {trip.memberCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
