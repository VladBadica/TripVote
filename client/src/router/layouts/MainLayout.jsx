import { Outlet } from 'react-router-dom'
import TopNavbar from '../../common/TopNavbar'
import BottomNav from '../../common/BottomNav'

export default function MainLayout() {
  return (
    <div className="app-shell">
      <TopNavbar />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
