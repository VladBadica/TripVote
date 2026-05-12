import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import TripCard from './TripCard';
import CreateTripModal from './CreateTripModal';
import { getMyTrips, joinTripByInviteCode } from '../../services/tripsService';
import { useAsync } from '../../common/useAsync';
import { useService } from '../../common/useService';
import { TripCardSkeleton } from '../../components/Skeletons';
import EmptyState from '../../components/EmptyState';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: trips, loading, refresh } = useAsync(() => getMyTrips());
  const call = useService();
  const [showModal, setShowModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Traveller'

  const handleJoin = async (e) => {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoining(true)
    const data = await call(joinTripByInviteCode, joinCode.trim())
    setJoining(false)
    if (data) { setJoinCode(''); refresh() }
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

      {loading && <TripCardSkeleton count={3} />}

      {!loading && !trips?.length && (
        <EmptyState
          icon="✈️"
          title={t('dashboard.empty.title')}
          subtitle={t('dashboard.empty.subtitle')}
          action={<button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>{t('dashboard.empty.cta')}</button>}
        />
      )}

      {!loading && trips?.map(trip => <TripCard key={trip.id} trip={trip} />)}

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
            <button type="submit" className="btn btn-outline-primary btn-sm flex-shrink-0" disabled={!joinCode.trim() || joining}>
              {joining
                ? <span className="spinner-border spinner-border-sm" role="status" />
                : t('dashboard.join')}
            </button>
          </form>
        </div>
      </div>

      <CreateTripModal show={showModal} onHide={() => setShowModal(false)} />
    </div>
  )
}
