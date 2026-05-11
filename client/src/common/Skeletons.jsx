export function TripCardSkeleton({ count = 3 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="card border-0 shadow-sm mb-3 placeholder-glow">
      <div className="card-body p-3 d-flex align-items-center gap-3">
        <span className="placeholder rounded-3 flex-shrink-0" style={{ width: 48, height: 48 }} />
        <div className="flex-grow-1">
          <span className="placeholder col-6 d-block mb-2 rounded" />
          <span className="placeholder col-4 d-block rounded" />
        </div>
        <span className="placeholder col-2 rounded" />
      </div>
    </div>
  ))
}

export function PollCardSkeleton({ count = 3 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="card border-0 shadow-sm mb-3 placeholder-glow">
      <div className="card-body p-3">
        <span className="placeholder col-3 d-block mb-2 rounded" />
        <span className="placeholder col-7 d-block mb-3 rounded" />
        <span className="placeholder col-12 d-block mb-2 rounded" style={{ height: 32 }} />
        <span className="placeholder col-12 d-block rounded" style={{ height: 32 }} />
      </div>
    </div>
  ))
}

export function ChecklistSkeleton({ count = 4 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="checklist-item d-flex align-items-center gap-3 p-3 rounded-3 mb-2 placeholder-glow">
      <span className="placeholder rounded-circle flex-shrink-0" style={{ width: 28, height: 28 }} />
      <span className="placeholder rounded flex-grow-1" style={{ height: 16 }} />
    </div>
  ))
}
