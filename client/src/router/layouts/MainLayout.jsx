import { Outlet } from 'react-router-dom'
import TopNavbar from '../../common/TopNavbar'
import BottomNav from '../../common/BottomNav'
import InfoModal from '../../common/modals/InfoModal'

export default function MainLayout() {
  return <div className="app-shell">
    <InfoModal />
    <TopNavbar />
    <main className="main-content">
      <Outlet />
    </main>
    <BottomNav />
  </div>
}
