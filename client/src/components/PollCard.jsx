import { ProgressBar } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripContext'

const TYPE_ICON = { destination: '🌍', transport: '🚌', activity: '🎯', general: '💬' }

function formatTime(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PollCard({ poll }) {
  const { user } = useAuth()
  const { castVote } = useTrips()

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
  const userId = user?.id

  function handleVote(optId) {
    if (poll.closed) return
    castVote(poll.id, optId, userId)
  }

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span>{TYPE_ICON[poll.type] ?? '💬'}</span>
          <span className="text-muted small text-capitalize">{poll.type}</span>
          {poll.closed && <span className="badge bg-secondary-subtle text-secondary-emphasis ms-auto">Closed</span>}
        </div>
        <h6 className="fw-semibold mb-3">{poll.question}</h6>

        <div className="d-flex flex-column gap-2">
          {poll.options.map(opt => {
            const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0
            const voted = opt.votes.includes(userId)
            return (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                disabled={poll.closed}
                className={`poll-option btn text-start p-0 border-0 ${voted ? 'voted' : ''}`}
              >
                <div className="d-flex justify-content-between align-items-center mb-1 px-1">
                  <span className="small fw-medium">{opt.label}</span>
                  <span className="small text-muted">{opt.votes.length} {opt.votes.length === 1 ? 'vote' : 'votes'}</span>
                </div>
                <ProgressBar
                  now={pct}
                  className={`poll-progress ${voted ? 'voted-bar' : ''}`}
                  style={{ height: 6 }}
                />
              </button>
            )
          })}
        </div>

        <p className="text-muted small mt-3 mb-0">
          By {poll.createdBy} · {formatTime(poll.createdAt)} · {totalVotes} total votes
        </p>
      </div>
    </div>
  )
}
