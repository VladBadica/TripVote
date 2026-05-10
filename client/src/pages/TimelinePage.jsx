import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTrips } from '../context/TripContext'
import ActivityItem from '../components/ActivityItem'

export default function TimelinePage() {
  const { tripId } = useParams()
  const { getActivitiesByTrip } = useTrips()
  const { t } = useTranslation()
  const activities = getActivitiesByTrip(tripId)

  return (
    <div className="page-container pb-nav">
      <h5 className="fw-bold mb-4">{t('timeline.title')}</h5>

      {activities.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-state-emoji">⚡</div>
          <h5 className="fw-bold mt-3">{t('timeline.empty.title')}</h5>
          <p className="text-muted small">{t('timeline.empty.subtitle')}</p>
        </div>
      ) : (
        <div className="timeline">
          {activities.map(a => <ActivityItem key={a.id} activity={a} />)}
        </div>
      )}
    </div>
  )
}
