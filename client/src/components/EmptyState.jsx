export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state text-center py-5">
      <div className="empty-state-emoji">{icon}</div>
      <h5 className="fw-bold mt-3">{title}</h5>
      {subtitle && <p className="text-muted small">{subtitle}</p>}
      {action}
    </div>
  )
}
