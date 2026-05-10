import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTrips } from '../context/TripContext'
import { mockMembers } from '../mock/mockData'
import { moment } from '../i18n'

export default function TripDetailPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { getTripById, getPollsByTrip, getChecklistByTrip } = useTrips()

  const trip = getTripById(tripId)
  if (!trip) {
    return (
      <div className="page-container text-center py-5">
        <p className="text-muted">{t('tripDetail.notFound')}</p>
        <button className="btn btn-primary-custom" onClick={() => navigate('/dashboard')}>
          {t('tripDetail.backToDashboard')}
        </button>
      </div>
    )
  }

  const polls = getPollsByTrip(tripId)
  const checklist = getChecklistByTrip(tripId)
  const done = checklist.filter(c => c.done).length

  function copyInvite() {
    navigator.clipboard.writeText(trip.inviteCode).then(() =>
      alert(t('tripDetail.inviteCopied', { code: trip.inviteCode }))
    )
  }

  return (
    <div className="page-container pb-nav">
      <div className="trip-detail-header mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <button className="btn btn-link p-0 text-muted" onClick={() => navigate('/dashboard')}>
            {t('tripDetail.back')}
          </button>
        </div>
        <div className="d-flex align-items-start gap-3">
          <div className="trip-emoji-badge lg">{trip.coverEmoji}</div>
          <div>
            <h4 className="fw-bold mb-1">{trip.name}</h4>
            <p className="text-muted mb-1 small">📍 {trip.destination}</p>
            <p className="text-muted mb-0 small">
              📅 {moment(trip.startDate).format('D MMM YYYY')}
              {trip.endDate && ` → ${moment(trip.endDate).format('D MMM YYYY')}`}
            </p>
          </div>
        </div>
      </div>

      <div className="invite-banner card border-0 mb-4 p-3 d-flex flex-row align-items-center justify-content-between gap-2">
        <div>
          <p className="fw-semibold small mb-0">{t('tripDetail.inviteFriends')}</p>
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
            {t('tripDetail.inviteCodeLabel')} <strong>{trip.inviteCode}</strong>
          </p>
        </div>
        <button className="btn btn-sm btn-outline-primary flex-shrink-0" onClick={copyInvite}>
          {t('tripDetail.copyCode')}
        </button>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-4">
          <Link to={`/trips/${tripId}/vote`} className="stat-card card border-0 text-decoration-none text-center p-3 h-100">
            <div className="stat-icon">🗳️</div>
            <div className="stat-value">{polls.length}</div>
            <div className="stat-label">{t('tripDetail.stats.polls')}</div>
          </Link>
        </div>
        <div className="col-4">
          <Link to={`/trips/${tripId}/checklist`} className="stat-card card border-0 text-decoration-none text-center p-3 h-100">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{done}/{checklist.length}</div>
            <div className="stat-label">{t('tripDetail.stats.tasksDone')}</div>
          </Link>
        </div>
        <div className="col-4">
          <div className="stat-card card border-0 text-center p-3 h-100">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{trip.memberCount}</div>
            <div className="stat-label">{t('tripDetail.stats.members')}</div>
          </div>
        </div>
      </div>

      <div className="section-block card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <p className="fw-semibold small mb-3">{t('tripDetail.membersSection')}</p>
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

      <div className="d-flex flex-column gap-2">
        <Link to={`/trips/${tripId}/vote`} className="quick-link card border-0 shadow-sm text-decoration-none p-3 d-flex flex-row align-items-center justify-content-between">
          <span className="fw-medium small">{t('tripDetail.quickLinks.viewPolls')}</span>
          <span className="text-muted">›</span>
        </Link>
        <Link to={`/trips/${tripId}/checklist`} className="quick-link card border-0 shadow-sm text-decoration-none p-3 d-flex flex-row align-items-center justify-content-between">
          <span className="fw-medium small">{t('tripDetail.quickLinks.openChecklist')}</span>
          <span className="text-muted">›</span>
        </Link>
      </div>
    </div>
  )
}
