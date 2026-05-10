import { useState } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '../context/TripContext'

const EMOJIS = ['✈️', '🏝️', '⛷️', '🏕️', '🌆', '🗺️', '🚢', '🎡', '🌋', '🏔️']

export default function CreateTripModal({ show, onHide }) {
  const { createTrip } = useTrips()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', destination: '', startDate: '', endDate: '', coverEmoji: '✈️' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validate() {
    if (!form.name.trim()) return 'Trip name is required.'
    if (!form.destination.trim()) return 'Destination is required.'
    if (!form.startDate) return 'Start date is required.'
    if (form.endDate && form.endDate < form.startDate) return 'End date must be after start date.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    const trip = createTrip({ ...form })
    setLoading(false)
    setForm({ name: '', destination: '', startDate: '', endDate: '', coverEmoji: '✈️' })
    setError('')
    onHide()
    navigate(`/trips/${trip.id}`)
  }

  return (
    <Modal show={show} onHide={onHide} centered className="create-trip-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-5">New Trip ✈️</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <p className="small fw-medium mb-2">Pick an icon</p>
            <div className="d-flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e} type="button"
                  className={`emoji-picker-btn ${form.coverEmoji === e ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, coverEmoji: e }))}
                >{e}</button>
              ))}
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium">Trip name</Form.Label>
            <Form.Control
              name="name" value={form.name} onChange={handleChange}
              placeholder="Greek Islands Summer" autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium">Destination</Form.Label>
            <Form.Control
              name="destination" value={form.destination} onChange={handleChange}
              placeholder="Santorini, Greece"
            />
          </Form.Group>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <Form.Label className="small fw-medium">Start date</Form.Label>
              <Form.Control type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </div>
            <div className="col-6">
              <Form.Label className="small fw-medium">End date</Form.Label>
              <Form.Control type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            </div>
          </div>

          <Button type="submit" className="w-100 btn-primary-custom" disabled={loading}>
            {loading ? 'Creating…' : 'Create trip'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
