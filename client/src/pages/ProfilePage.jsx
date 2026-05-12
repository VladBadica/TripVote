import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateProfile, changePassword } from '../services/profileService'
import { useService } from '../common/useService'

const AVATAR_EMOJIS = ['🧑', '👩', '👨', '👦', '👧', '🧔', '👱', '🧓', '🧕', '🎅', '🧑‍🎤', '🧑‍💼', '🧑‍🚀', '🦸', '🧙', '🦹']

export default function ProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const call = useService()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatarEmoji, setAvatarEmoji] = useState('🧑')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState('')

  useEffect(function loadProfile() {
    async function load() {
      const data = await call(getProfile)
      if (data) {
        const parts = (data.full_name ?? '').trim().split(' ')
        setFirstName(parts[0] ?? '')
        setLastName(parts.slice(1).join(' '))
        setAvatarEmoji(data.avatar_emoji ?? '🧑')
      } else {
        // fall back to auth metadata if profile row is empty
        const fullName = user?.user_metadata?.full_name ?? ''
        const parts = fullName.trim().split(' ')
        setFirstName(parts[0] ?? '')
        setLastName(parts.slice(1).join(' '))
        setAvatarEmoji(user?.user_metadata?.avatar_emoji ?? '🧑')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const trimFirst = firstName.trim()
    if (!trimFirst) { setError(t('profile.validation.firstNameRequired')); return }
    setError('')
    setSaving(true)
    setSuccess(false)
    const fullName = [trimFirst, lastName.trim()].filter(Boolean).join(' ')
    const result = await call(updateProfile, { fullName, avatarEmoji })
    setSaving(false)
    if (result) setSuccess(true)
  }

  const previewInitials = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || '?'

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    if (newPassword.length < 6) { setPwError(t('profile.password.validation.tooShort')); return }
    if (newPassword !== confirmPassword) { setPwError(t('profile.password.validation.mismatch')); return }
    setPwError('')
    setPwSaving(true)
    setPwSuccess(false)
    const result = await call(changePassword, newPassword)
    setPwSaving(false)
    if (result) {
      setPwSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div className="page-container pb-nav">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-link p-0 text-muted" onClick={() => navigate('/dashboard')}>
          {t('profile.back')}
        </button>
      </div>

      <h5 className="fw-bold mb-4">{t('profile.title')}</h5>

      {loading ? (
        <div className="placeholder-glow">
          <div className="d-flex flex-column align-items-center mb-4">
            <span className="placeholder rounded-circle mb-3" style={{ width: 72, height: 72 }} />
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="placeholder rounded" style={{ width: 44, height: 44 }} />
              ))}
            </div>
          </div>
          <span className="placeholder col-12 d-block mb-3 rounded" style={{ height: 40 }} />
          <span className="placeholder col-12 d-block mb-4 rounded" style={{ height: 40 }} />
          <span className="placeholder col-12 d-block rounded" style={{ height: 44 }} />
        </div>
      ) : (
        <>
        <Form onSubmit={handleSubmit}>
          {success && (
            <Alert variant="success" className="small" onClose={() => setSuccess(false)} dismissible>
              {t('profile.saved')}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="small" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <div className="d-flex flex-column align-items-center mb-4">
            <div className="avatar-circle avatar-circle-lg mb-3" style={{ fontSize: '2rem' }}>
              {avatarEmoji}
            </div>
            <p className="small fw-medium mb-2 text-muted">{t('profile.pickAvatar')}</p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {AVATAR_EMOJIS.map(e => (
                <button
                  key={e} type="button"
                  className={`emoji-picker-btn ${avatarEmoji === e ? 'selected' : ''}`}
                  onClick={() => setAvatarEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium">{t('profile.firstName')}</Form.Label>
            <Form.Control
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder={t('profile.firstNamePlaceholder')}
              autoComplete="given-name"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-medium">{t('profile.lastName')}</Form.Label>
            <Form.Control
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder={t('profile.lastNamePlaceholder')}
              autoComplete="family-name"
            />
          </Form.Group>

          <Button type="submit" className="w-100 btn-primary-custom" disabled={saving}>
            {saving ? t('profile.saving') : t('profile.save')}
          </Button>
        </Form>

        <hr className="my-4" />

        <h6 className="fw-semibold mb-3">{t('profile.password.title')}</h6>
        <Form onSubmit={handlePasswordSubmit}>
          {pwSuccess && (
            <Alert variant="success" className="small" onClose={() => setPwSuccess(false)} dismissible>
              {t('profile.password.saved')}
            </Alert>
          )}
          {pwError && (
            <Alert variant="danger" className="small" onClose={() => setPwError('')} dismissible>
              {pwError}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium">{t('profile.password.newPassword')}</Form.Label>
            <InputGroup>
              <Form.Control
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder={t('profile.password.newPasswordPlaceholder')}
                autoComplete="new-password"
              />
              <InputGroup.Text
                role="button"
                onClick={() => setShowNew(v => !v)}
                style={{ cursor: 'pointer' }}
              >
                {showNew ? '🙈' : '👁️'}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-medium">{t('profile.password.confirmPassword')}</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder={t('profile.password.confirmPasswordPlaceholder')}
                autoComplete="new-password"
              />
              <InputGroup.Text
                role="button"
                onClick={() => setShowConfirm(v => !v)}
                style={{ cursor: 'pointer' }}
              >
                {showConfirm ? '🙈' : '👁️'}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="outline-primary" className="w-100" disabled={pwSaving}>
            {pwSaving ? t('profile.password.saving') : t('profile.password.save')}
          </Button>
        </Form>
        </>
      )}
    </div>
  )
}
