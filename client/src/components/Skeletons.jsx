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

export function TripDetailSkeleton() {
  return (
    <div className="page-container pb-nav placeholder-glow">
      {/* header */}
      <div className="trip-detail-header mb-4">
        <span className="placeholder col-2 d-block mb-2 rounded" style={{ height: 14 }} />
        <div className="d-flex align-items-start gap-3">
          <span className="placeholder rounded-3 flex-shrink-0" style={{ width: 52, height: 52 }} />
          <div className="flex-grow-1">
            <span className="placeholder col-5 d-block mb-2 rounded" style={{ height: 20 }} />
            <span className="placeholder col-4 d-block mb-1 rounded" style={{ height: 14 }} />
            <span className="placeholder col-6 d-block rounded" style={{ height: 14 }} />
          </div>
        </div>
      </div>

      {/* invite banner */}
      <div className="card border-0 mb-4 p-3 d-flex flex-row align-items-center justify-content-between gap-2">
        <div className="flex-grow-1">
          <span className="placeholder col-5 d-block mb-1 rounded" style={{ height: 14 }} />
          <span className="placeholder col-7 d-block rounded" style={{ height: 12 }} />
        </div>
        <span className="placeholder rounded col-2 flex-shrink-0" style={{ height: 32 }} />
      </div>

      {/* stat cards */}
      <div className="row g-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="col-4">
            <div className="stat-card card border-0 text-center p-3 h-100">
              <span className="placeholder rounded-circle mx-auto mb-2" style={{ width: 32, height: 32 }} />
              <span className="placeholder col-4 mx-auto d-block mb-1 rounded" style={{ height: 18 }} />
              <span className="placeholder col-8 mx-auto d-block rounded" style={{ height: 12 }} />
            </div>
          </div>
        ))}
      </div>

      {/* members */}
      <div className="section-block card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <span className="placeholder col-3 d-block mb-3 rounded" style={{ height: 14 }} />
          <div className="d-flex flex-column gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="d-flex align-items-center gap-3">
                <span className="placeholder rounded-circle flex-shrink-0" style={{ width: 36, height: 36 }} />
                <div className="flex-grow-1">
                  <span className="placeholder col-4 d-block mb-1 rounded" style={{ height: 14 }} />
                  <span className="placeholder col-3 d-block rounded" style={{ height: 11 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* quick links */}
      <div className="d-flex flex-column gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card border-0 shadow-sm p-3">
            <span className="placeholder col-4 rounded" style={{ height: 14 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
