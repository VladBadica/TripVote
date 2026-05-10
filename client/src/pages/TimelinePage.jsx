import { useParams } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import ActivityItem from '../components/ActivityItem'

export default function TimelinePage() {
  const { tripId } = useParams()
  const { getActivitiesByTrip } = useTrips()
  const activities = getActivitiesByTrip(tripId)

  return (
    <div className="page-container pb-nav">
      <h5 className="fw-bold mb-4">⚡ Activity</h5>

      {activities.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-state-emoji">⚡</div>
          <h5 className="fw-bold mt-3">No activity yet</h5>
          <p className="text-muted small">Actions like creating polls and completing tasks will show up here.</p>
        </div>
      ) : (
        <div className="timeline">
          {activities.map(a => <ActivityItem key={a.id} activity={a} />)}
        </div>
      )}
    </div>
  )
}
