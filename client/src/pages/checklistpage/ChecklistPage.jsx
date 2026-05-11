import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ChecklistItem from './ChecklistItem'
import { getChecklistByTrip, addChecklistItem } from '../../services/tripsService'
import { useService } from '../../common/useService'

export default function ChecklistPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const call = useService()
  const [checklist, setChecklist] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')

  async function refreshChecklist() {
    setLoading(true)
    const data = await call(getChecklistByTrip, tripId)
    if (data) setChecklist(data)
    setLoading(false)
  }

  useEffect(() => { refreshChecklist() }, [tripId])

  async function handleAdd(e) {
    e.preventDefault()
    if (!text.trim()) return
    const data = await call(addChecklistItem, tripId, text.trim())
    if (data) { setText(''); refreshChecklist() }
  }

  const done = checklist.filter(c => c.done)
  const todo = checklist.filter(c => !c.done)
  const pct = checklist.length > 0 ? Math.round((done.length / checklist.length) * 100) : 0

  return (
    <div className="page-container pb-nav">
      <button className="btn btn-link p-0 text-muted mb-3" onClick={() => navigate(`/trips/${tripId}`)}>
        {t('tripDetail.back')}
      </button>

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

      {loading ? (
        [0, 1, 2, 3].map(i => (
          <div key={i} className="checklist-item d-flex align-items-center gap-3 p-3 rounded-3 mb-2 placeholder-glow">
            <span className="placeholder rounded-circle flex-shrink-0" style={{ width: 28, height: 28 }} />
            <span className="placeholder rounded flex-grow-1" style={{ height: 16 }} />
          </div>
        ))
      ) : (
        <>
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
              {todo.map(item => <ChecklistItem key={item.id} item={item} onRefresh={refreshChecklist} />)}
            </>
          )}

          {done.length > 0 && (
            <>
              <p className="small fw-semibold text-muted mb-2 mt-4 text-uppercase" style={{ letterSpacing: '0.05em' }}>
                {t('checklist.completedSection')}
              </p>
              {done.map(item => <ChecklistItem key={item.id} item={item} onRefresh={refreshChecklist} />)}
            </>
          )}
        </>
      )}
    </div>
  )
}
