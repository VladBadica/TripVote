import { Outlet } from 'react-router-dom'
import TopNavbar from '../../components/TopNavbar'
import BottomNav from '../../components/BottomNav'
import InfoModal from '../../components/modals/InfoModal'

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
