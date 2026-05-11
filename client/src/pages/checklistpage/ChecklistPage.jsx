import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ChecklistItem from './ChecklistItem'
import { getChecklistByTrip, addChecklistItem } from '../../services/tripsService'
import { useAsync } from '../../common/useAsync'
import { useService } from '../../common/useService'
import { ChecklistSkeleton } from '../../common/Skeletons'
import EmptyState from '../../common/EmptyState'

export default function ChecklistPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const call = useService()
  const { data: checklist, loading, refresh: refreshChecklist } = useAsync(() => getChecklistByTrip(tripId), [tripId])
  const [text, setText] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!text.trim()) return
    const data = await call(addChecklistItem, tripId, text.trim())
    if (data) { setText(''); refreshChecklist() }
  }

  const items = checklist ?? []
  const done = items.filter(c => c.done)
  const todo = items.filter(c => !c.done)
  const pct = items.length > 0 ? Math.round((done.length / items.length) * 100) : 0

  return (
    <div className="page-container pb-nav">
      <button className="btn btn-link p-0 text-muted mb-3" onClick={() => navigate(`/trips/${tripId}`)}>
        {t('tripDetail.back')}
      </button>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0">{t('checklist.title')}</h5>
        <span className="badge bg-primary-subtle text-primary-emphasis">
          {t('checklist.badge', { done: done.length, total: items.length })}
        </span>
      </div>

      {items.length > 0 && (
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

      {loading && <ChecklistSkeleton count={4} />}

      {!loading && !items.length && (
        <EmptyState
          icon="📋"
          title={t('checklist.empty.title')}
          subtitle={t('checklist.empty.subtitle')}
        />
      )}

      {!loading && todo.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.05em' }}>
            {t('checklist.todoSection')}
          </p>
          {todo.map(item => <ChecklistItem key={item.id} item={item} onRefresh={refreshChecklist} />)}
        </>
      )}

      {!loading && done.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 mt-4 text-uppercase" style={{ letterSpacing: '0.05em' }}>
            {t('checklist.completedSection')}
          </p>
          {done.map(item => <ChecklistItem key={item.id} item={item} onRefresh={refreshChecklist} />)}
        </>
      )}
    </div>
  )
}
