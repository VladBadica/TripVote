import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTrips } from '../context/TripContext'
import ChecklistItem from '../components/ChecklistItem'

export default function ChecklistPage() {
  const { tripId } = useParams()
  const { getChecklistByTrip, addChecklistItem } = useTrips()
  const { t } = useTranslation()
  const checklist = getChecklistByTrip(tripId)

  const [text, setText] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!text.trim()) return
    addChecklistItem(tripId, text.trim())
    setText('')
  }

  const done = checklist.filter(c => c.done)
  const todo = checklist.filter(c => !c.done)
  const pct = checklist.length > 0 ? Math.round((done.length / checklist.length) * 100) : 0

  return (
    <div className="page-container pb-nav">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0">{t('checklist.title')}</h5>
        <span className="badge bg-primary-subtle text-primary-emphasis">
          {t('checklist.badge', { done: done.length, total: checklist.length })}
        </span>
      </div>

      {checklist.length > 0 && (
        <div className="mb-4">
          <div className="progress" style={{ height: 6 }}>
            <div className="progress-bar bg-success" style={{ width: `${pct}%`, transition: 'width 0.4s ease' }} />
          </div>
          <p className="text-muted small mt-1 mb-0">{t('checklist.progress', { pct })}</p>
        </div>
      )}

      <form onSubmit={handleAdd} className="d-flex gap-2 mb-4">
        <input
          className="form-control"
          placeholder={t('checklist.placeholder')}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary-custom flex-shrink-0" disabled={!text.trim()}>
          {t('checklist.add')}
        </button>
      </form>

      {checklist.length === 0 && (
        <div className="empty-state text-center py-5">
          <div className="empty-state-emoji">📋</div>
          <h5 className="fw-bold mt-3">{t('checklist.empty.title')}</h5>
          <p className="text-muted small">{t('checklist.empty.subtitle')}</p>
        </div>
      )}

      {todo.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.05em' }}>
            {t('checklist.todoSection')}
          </p>
          {todo.map(item => <ChecklistItem key={item.id} item={item} />)}
        </>
      )}

      {done.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 mt-4 text-uppercase" style={{ letterSpacing: '0.05em' }}>
            {t('checklist.completedSection')}
          </p>
          {done.map(item => <ChecklistItem key={item.id} item={item} />)}
        </>
      )}
    </div>
  )
}
