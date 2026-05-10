import { moment } from '../i18n'

const TYPE_ICON = {
  trip_created: '🎉',
  member_joined: '👋',
  poll_created: '🗳️',
  poll_voted: '✔️',
  checklist_done: '✅',
  checklist_added: '➕'
}

export default function ActivityItem({ activity }) {
  const icon = TYPE_ICON[activity.type] ?? '📌'

  return (
    <div className="activity-item d-flex gap-3 align-items-start mb-3">
      <div className="activity-icon flex-shrink-0">{icon}</div>
      <div className="flex-grow-1">
        <p className="mb-0 small">
          <span className="fw-semibold">{activity.actor}</span>{' '}
          {activity.message}
        </p>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
          {moment(activity.timestamp).fromNow()}
        </span>
      </div>
    </div>
  )
}
