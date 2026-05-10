const TYPE_ICON = {
  trip_created: '🎉',
  member_joined: '👋',
  poll_created: '🗳️',
  poll_voted: '✔️',
  checklist_done: '✅',
  checklist_added: '➕'
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
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
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{timeAgo(activity.timestamp)}</span>
      </div>
    </div>
  )
}
