import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import PollCard from './PollCard'
import { getPollsByTrip, createPoll } from '../../services/tripsService'
import { useService } from '../../common/useService'

const POLL_TYPES = ['destination', 'transport', 'general']

export default function VotingPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const call = useService()
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ question: '', type: 'destination', options: ['', ''] })
  const [submitting, setSubmitting] = useState(false)

  async function refreshPolls() {
    setLoading(true)
    const data = await call(getPollsByTrip, tripId)
    if (data) setPolls(data)
    setLoading(false)
  }

  useEffect(() => { refreshPolls() }, [tripId])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleOptionChange(i, val) {
    setForm(prev => {
      const options = [...prev.options]
      options[i] = val
      return { ...prev, options }
    })
  }

  function addOption() {
    if (form.options.length >= 6) return
    setForm(prev => ({ ...prev, options: [...prev.options, ''] }))
  }

  function removeOption(i) {
    if (form.options.length <= 2) return
    setForm(prev => ({ ...prev, options: prev.options.filter((_, idx) => idx !== i) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const clean = form.options.map(o => o.trim()).filter(Boolean)
    if (!form.question.trim() || clean.length < 2) return
    setSubmitting(true)
    const data = await call(createPoll, tripId, { question: form.question, type: form.type, options: clean })
    setSubmitting(false)
    if (!data) return
    const refreshed = await call(getPollsByTrip, tripId)
    if (refreshed) setPolls(refreshed)
    setForm({ question: '', type: 'destination', options: ['', ''] })
    setShowModal(false)
  }

  const open = polls.filter(p => !p.closed)
  const closed = polls.filter(p => p.closed)

  return (
    <div className="page-container pb-nav">
      <button className="btn btn-link p-0 text-muted mb-3" onClick={() => navigate(`/trips/${tripId}`)}>
        {t('tripDetail.back')}
      </button>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold mb-0">{t('voting.title')}</h5>
        <button className="btn btn-primary-custom btn-sm" onClick={() => setShowModal(true)}>
          {t('voting.newPoll')}
        </button>
      </div>

      {loading ? (
        [0, 1, 2].map(i => (
          <div key={i} className="card border-0 shadow-sm mb-3 placeholder-glow">
            <div className="card-body p-3">
              <span className="placeholder col-3 d-block mb-2 rounded" />
              <span className="placeholder col-7 d-block mb-3 rounded" />
              <span className="placeholder col-12 d-block mb-2 rounded" style={{ height: 32 }} />
              <span className="placeholder col-12 d-block rounded" style={{ height: 32 }} />
            </div>
          </div>
        ))
      ) : null}

      {!loading && open.length === 0 && closed.length === 0 && (
        <div className="empty-state text-center py-5">
          <div className="empty-state-emoji">🗳️</div>
          <h5 className="fw-bold mt-3">{t('voting.empty.title')}</h5>
          <p className="text-muted small">{t('voting.empty.subtitle')}</p>
          <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
            {t('voting.empty.cta')}
          </button>
        </div>
      )}

      {!loading && open.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.05em' }}>
            {t('voting.activeSection')}
          </p>
          {open.map(p => <PollCard key={p.id} poll={p} onVote={refreshPolls} />)}
        </>
      )}

      {!loading && closed.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 mt-4 text-uppercase" style={{ letterSpacing: '0.05em' }}>
            {t('voting.closedSection')}
          </p>
          {closed.map(p => <PollCard key={p.id} poll={p} onVote={refreshPolls} />)}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold fs-5">{t('voting.modal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium">{t('voting.modal.typeLabel')}</Form.Label>
              <Form.Select name="type" value={form.type} onChange={handleChange}>
                {POLL_TYPES.map(type => (
                  <option key={type} value={type}>{t(`voting.pollTypes.${type}`)}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium">{t('voting.modal.questionLabel')}</Form.Label>
              <Form.Control
                name="question" value={form.question} onChange={handleChange}
                placeholder={t('voting.modal.questionPlaceholder')} autoFocus
              />
            </Form.Group>
            <Form.Label className="small fw-medium">{t('voting.modal.optionsLabel')}</Form.Label>
            {form.options.map((opt, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <Form.Control
                  value={opt} onChange={e => handleOptionChange(i, e.target.value)}
                  placeholder={t('voting.modal.optionPlaceholder', { number: i + 1 })}
                />
                {form.options.length > 2 && (
                  <button type="button" className="btn btn-link text-muted p-0 px-1" onClick={() => removeOption(i)}>×</button>
                )}
              </div>
            ))}
            {form.options.length < 6 && (
              <button type="button" className="btn btn-link p-0 small mb-3" onClick={addOption}>
                {t('voting.modal.addOption')}
              </button>
            )}
            <Button type="submit" className="w-100 btn-primary-custom mt-2" disabled={submitting}>
              {t('voting.modal.submit')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}
