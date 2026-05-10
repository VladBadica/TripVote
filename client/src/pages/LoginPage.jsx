import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await login(form.email, form.password)
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate('/dashboard')
  }

  return (
    <>
      <h2 className="fw-bold mb-1 fs-4">Welcome back</h2>
      <p className="text-muted small mb-4">Log in to your account</p>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="small fw-medium">Email</Form.Label>
          <Form.Control
            type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" autoComplete="email"
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="small fw-medium">Password</Form.Label>
          <Form.Control
            type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="••••••••" autoComplete="current-password"
          />
        </Form.Group>
        <Button type="submit" className="w-100 btn-primary-custom" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </Form>

      <p className="text-center text-muted small mt-4 mb-0">
        Don't have an account? <Link to="/register" className="text-primary fw-medium">Sign up</Link>
      </p>
    </>
  )
}
