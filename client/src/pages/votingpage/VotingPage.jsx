import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import PollCard from './PollCard'
import { getPollsByTrip, createPoll } from '../../services/tripsService'
import { useAsync } from '../../common/useAsync'
import { useService } from '../../common/useService'
import { PollCardSkeleton } from '../../components/Skeletons'
import EmptyState from '../../components/EmptyState'

const POLL_TYPES = ['destination', 'transport', 'general']

export default function VotingPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const call = useService()
  const { data: polls, loading, refresh: refreshPolls } = useAsync(() => getPollsByTrip(tripId), [tripId])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ question: '', type: 'destination', options: ['', ''] })
  const [submitting, setSubmitting] = useState(false)

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
    refreshPolls()
    setForm({ question: '', type: 'destination', options: ['', ''] })
    setShowModal(false)
  }

  const open = polls?.filter(p => !p.closed) ?? []
  const closed = polls?.filter(p => p.closed) ?? []

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

      {loading && <PollCardSkeleton count={3} />}

      {!loading && !polls?.length && (
        <EmptyState
          icon="🗳️"
          title={t('voting.empty.title')}
          subtitle={t('voting.empty.subtitle')}
          action={<button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>{t('voting.empty.cta')}</button>}
        />
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
