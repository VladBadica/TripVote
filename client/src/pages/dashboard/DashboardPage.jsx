import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useTrips } from '../../context/TripContext'
import TripCard from '../../components/TripCard'
import CreateTripModal from './CreateTripModal'

export default function DashboardPage() {
  const { user } = useAuth()
  const { trips } = useTrips()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Traveller'

  function handleJoin(e) {
    e.preventDefault()
    alert(t('dashboard.joiningAlert', { code: joinCode.toUpperCase() }))
    setJoinCode('')
  }

  return (
    <div className="page-container pb-nav">
      <div className="page-header d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-0">{t('dashboard.greeting', { name: firstName })}</h4>
          <p className="text-muted small mb-0">{t('dashboard.subtitle')}</p>
        </div>
        <button className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1" onClick={() => setShowModal(true)}>
          {t('dashboard.newTrip')}
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-state-emoji">✈️</div>
          <h5 className="fw-bold mt-3">{t('dashboard.empty.title')}</h5>
          <p className="text-muted small">{t('dashboard.empty.subtitle')}</p>
          <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
            {t('dashboard.empty.cta')}
          </button>
        </div>
      ) : (
        trips.map(trip => <TripCard key={trip.id} trip={trip} />)
      )}

      <div className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3">
          <p className="small fw-semibold mb-2">{t('dashboard.joinTrip')}</p>
          <form onSubmit={handleJoin} className="d-flex gap-2">
            <input
              className="form-control form-control-sm"
              placeholder={t('dashboard.inviteCodePlaceholder')}
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              maxLength={10}
            />
            <button type="submit" className="btn btn-outline-primary btn-sm flex-shrink-0" disabled={!joinCode.trim()}>
              {t('dashboard.join')}
            </button>
          </form>
        </div>
      </div>

      <CreateTripModal show={showModal} onHide={() => setShowModal(false)} />
    </div>
  )
}
