import { useTranslation } from 'react-i18next'
import { useService } from '../../common/useService'
import { toggleChecklistItem, deleteChecklistItem } from '../../services/tripsService'

export default function ChecklistItem({ item, onRefresh }) {
  const call = useService()
  const { t } = useTranslation()

  async function handleToggle() {
    const data = await call(toggleChecklistItem, item.id, !item.done)
    if (data) onRefresh?.()
  }

  async function handleDelete() {
    const data = await call(deleteChecklistItem, item.id)
    if (data) onRefresh?.()
  }

  return (
    <div className={`checklist-item d-flex align-items-center gap-3 p-3 rounded-3 mb-2 ${item.done ? 'done' : ''}`}>
      <button
        className={`check-btn flex-shrink-0 ${item.done ? 'checked' : ''}`}
        onClick={handleToggle}
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
        onClick={handleDelete}
        aria-label={t('checklistItem.deleteItem')}
      >
        ×
      </button>
    </div>
  )
}
