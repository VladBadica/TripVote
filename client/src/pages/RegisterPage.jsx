import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validate() {
    if (!form.fullName.trim()) return t('auth.register.validation.fullNameRequired')
    if (!form.email) return t('auth.register.validation.emailRequired')
    if (form.password.length < 6) return t('auth.register.validation.passwordMin')
    if (form.password !== form.confirm) return t('auth.register.validation.passwordMismatch')
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    setError('')
    const { error: regErr } = await register(form.email, form.password, form.fullName)
    setLoading(false)
    if (regErr) { setError(regErr.message); return }
    navigate('/dashboard')
  }

  return (
    <>
      <h2 className="fw-bold mb-1 fs-4">{t('auth.register.title')}</h2>
      <p className="text-muted small mb-4">{t('auth.register.subtitle')}</p>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="small fw-medium">{t('auth.register.fullName')}</Form.Label>
          <Form.Control
            name="fullName" value={form.fullName} onChange={handleChange}
            placeholder="Alex Rivera" autoFocus
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="small fw-medium">{t('auth.register.email')}</Form.Label>
          <Form.Control
            type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="small fw-medium">{t('auth.register.password')}</Form.Label>
          <Form.Control
            type="password" name="password" value={form.password} onChange={handleChange}
            placeholder={t('auth.register.passwordPlaceholder')}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="small fw-medium">{t('auth.register.confirmPassword')}</Form.Label>
          <Form.Control
            type="password" name="confirm" value={form.confirm} onChange={handleChange}
            placeholder="••••••••"
          />
        </Form.Group>
        <Button type="submit" className="w-100 btn-primary-custom" disabled={loading}>
          {loading ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>
      </Form>

      <p className="text-center text-muted small mt-4 mb-0">
        {t('auth.register.haveAccount')}{' '}
        <Link to="/login" className="text-primary fw-medium">{t('auth.register.logIn')}</Link>
      </p>
    </>
  )
}
