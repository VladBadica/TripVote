import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripContext'
import TripCard from '../components/TripCard'
import CreateTripModal from '../components/CreateTripModal'

export default function DashboardPage() {
  const { user } = useAuth()
  const { trips } = useTrips()
  const [showModal, setShowModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Traveller'

  function handleJoin(e) {
    e.preventDefault()
    // Placeholder: in production look up invite code in Supabase
    alert(`Joining trip with code: ${joinCode.toUpperCase()}`)
    setJoinCode('')
  }

  return (
    <div className="page-container pb-nav">
      <div className="page-header d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-0">Hey, {firstName} 👋</h4>
          <p className="text-muted small mb-0">Your upcoming adventures</p>
        </div>
        <button className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1" onClick={() => setShowModal(true)}>
          <span>+</span> New trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-state-emoji">✈️</div>
          <h5 className="fw-bold mt-3">No trips yet</h5>
          <p className="text-muted small">Create your first trip or join one with an invite code.</p>
          <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>Create a trip</button>
        </div>
      ) : (
        <>
          {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
        </>
      )}

      <div className="card border-0 shadow-sm mt-3">
        <div className="card-body p-3">
          <p className="small fw-semibold mb-2">🔗 Join a trip</p>
          <form onSubmit={handleJoin} className="d-flex gap-2">
            <input
              className="form-control form-control-sm"
              placeholder="Enter invite code"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              maxLength={10}
            />
            <button type="submit" className="btn btn-outline-primary btn-sm flex-shrink-0" disabled={!joinCode.trim()}>
              Join
            </button>
          </form>
        </div>
      </div>

      <CreateTripModal show={showModal} onHide={() => setShowModal(false)} />
    </div>
  )
}
