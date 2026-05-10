import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripContext'

export default function ChecklistItem({ item }) {
  const { user } = useAuth()
  const { toggleChecklistItem, deleteChecklistItem } = useTrips()
  const { t } = useTranslation()

  const displayName = user?.user_metadata?.full_name ?? 'You'

  return (
    <div className={`checklist-item d-flex align-items-center gap-3 p-3 rounded-3 mb-2 ${item.done ? 'done' : ''}`}>
      <button
        className={`check-btn flex-shrink-0 ${item.done ? 'checked' : ''}`}
        onClick={() => toggleChecklistItem(item.id, displayName)}
        aria-label={item.done ? t('checklistItem.markIncomplete') : t('checklistItem.markComplete')}
      >
        {item.done ? '✓' : ''}
      </button>

      <div className="flex-grow-1 min-w-0">
        <p className={`mb-0 fw-medium ${item.done ? 'text-decoration-line-through text-muted' : ''}`}>
          {item.text}
        </p>
        {(item.assignee || item.dueDate) && (
          <div className="d-flex gap-2 mt-1">
            {item.assignee && <span className="text-muted small">👤 {item.assignee}</span>}
            {item.dueDate && <span className="text-muted small">📅 {item.dueDate}</span>}
          </div>
        )}
      </div>

      <button
        className="btn btn-link text-muted p-0 flex-shrink-0 delete-btn"
        onClick={() => deleteChecklistItem(item.id)}
        aria-label={t('checklistItem.deleteItem')}
      >
        ×
      </button>
    </div>
  )
}
