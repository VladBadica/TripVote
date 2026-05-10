import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Modal, Form, Button } from 'react-bootstrap'
import { useTrips } from '../context/TripContext'
import PollCard from '../components/PollCard'

const POLL_TYPES = ['destination', 'transport', 'activity', 'general']

export default function VotingPage() {
  const { tripId } = useParams()
  const { getPollsByTrip, createPoll } = useTrips()
  const polls = getPollsByTrip(tripId)

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ question: '', type: 'destination', options: ['', ''] })
  const [loading, setLoading] = useState(false)

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

  function handleSubmit(e) {
    e.preventDefault()
    const clean = form.options.map(o => o.trim()).filter(Boolean)
    if (!form.question.trim() || clean.length < 2) return
    setLoading(true)
    createPoll(tripId, form.question, form.type, clean)
    setLoading(false)
    setForm({ question: '', type: 'destination', options: ['', ''] })
    setShowModal(false)
  }

  const open = polls.filter(p => !p.closed)
  const closed = polls.filter(p => p.closed)

  return (
    <div className="page-container pb-nav">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold mb-0">🗳️ Polls</h5>
        <button className="btn btn-primary-custom btn-sm" onClick={() => setShowModal(true)}>
          + New poll
        </button>
      </div>

      {open.length === 0 && closed.length === 0 && (
        <div className="empty-state text-center py-5">
          <div className="empty-state-emoji">🗳️</div>
          <h5 className="fw-bold mt-3">No polls yet</h5>
          <p className="text-muted small">Create the first poll to start deciding together.</p>
          <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>Create poll</button>
        </div>
      )}

      {open.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.05em' }}>Active</p>
          {open.map(p => <PollCard key={p.id} poll={p} />)}
        </>
      )}

      {closed.length > 0 && (
        <>
          <p className="small fw-semibold text-muted mb-2 mt-4 text-uppercase" style={{ letterSpacing: '0.05em' }}>Closed</p>
          {closed.map(p => <PollCard key={p.id} poll={p} />)}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold fs-5">New poll 🗳️</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium">Type</Form.Label>
              <Form.Select name="type" value={form.type} onChange={handleChange}>
                {POLL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium">Question</Form.Label>
              <Form.Control
                name="question" value={form.question} onChange={handleChange}
                placeholder="Where should we stay?" autoFocus
              />
            </Form.Group>
            <Form.Label className="small fw-medium">Options</Form.Label>
            {form.options.map((opt, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <Form.Control
                  value={opt} onChange={e => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                />
                {form.options.length > 2 && (
                  <button type="button" className="btn btn-link text-muted p-0 px-1" onClick={() => removeOption(i)}>×</button>
                )}
              </div>
            ))}
            {form.options.length < 6 && (
              <button type="button" className="btn btn-link p-0 small mb-3" onClick={addOption}>+ Add option</button>
            )}
            <Button type="submit" className="w-100 btn-primary-custom mt-2" disabled={loading}>
              Create poll
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}
