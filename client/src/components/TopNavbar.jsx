import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Container, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
const APP_NAME = import.meta.env.VITE_APP_NAME

export default function TopNavbar() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Traveller'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Navbar className="top-navbar shadow-sm" sticky="top">
      <Container fluid className="px-3">
        <Link to="/dashboard" className="navbar-brand text-decoration-none d-flex align-items-center gap-2">
          <span className="fs-5">✈️</span>
          <span className="brand-name">{APP_NAME}</span>
        </Link>

        <Dropdown align="end">
          <Dropdown.Toggle as="button" className="avatar-btn border-0 bg-transparent p-0 d-flex align-items-center">
            <div className="avatar-circle">{initials}</div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="shadow border-0 mt-2">
            <Dropdown.Header className="fw-semibold">{displayName}</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger">
              {t('nav.signOut')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  )
}
