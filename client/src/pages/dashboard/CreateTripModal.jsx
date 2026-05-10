import { useState } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTrips } from '../../context/TripContext'

const EMOJIS = ['✈️', '🏝️', '⛷️', '🏕️', '🌆', '🗺️', '🚢', '🎡', '🌋', '🏔️']

export default function CreateTripModal({ show, onHide }) {
  const { createTrip } = useTrips()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [form, setForm] = useState({ name: '', destination: '', startDate: '', endDate: '', coverEmoji: '✈️' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validate() {
    if (!form.name.trim()) return t('createTrip.validation.nameRequired')
    if (!form.destination.trim()) return t('createTrip.validation.destinationRequired')
    if (!form.startDate) return t('createTrip.validation.startDateRequired')
    if (form.endDate && form.endDate < form.startDate) return t('createTrip.validation.endDateInvalid')
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
        <Modal.Title className="fw-bold fs-5">{t('createTrip.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <p className="small fw-medium mb-2">{t('createTrip.pickIcon')}</p>
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
            <Form.Label className="small fw-medium">{t('createTrip.tripName')}</Form.Label>
            <Form.Control
              name="name" value={form.name} onChange={handleChange}
              placeholder={t('createTrip.tripNamePlaceholder')} autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium">{t('createTrip.destination')}</Form.Label>
            <Form.Control
              name="destination" value={form.destination} onChange={handleChange}
              placeholder={t('createTrip.destinationPlaceholder')}
            />
          </Form.Group>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <Form.Label className="small fw-medium">{t('createTrip.startDate')}</Form.Label>
              <Form.Control type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </div>
            <div className="col-6">
              <Form.Label className="small fw-medium">{t('createTrip.endDate')}</Form.Label>
              <Form.Control type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            </div>
          </div>

          <Button type="submit" className="w-100 btn-primary-custom" disabled={loading}>
            {loading ? t('createTrip.submitting') : t('createTrip.submit')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
