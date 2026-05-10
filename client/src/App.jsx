import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TripProvider } from './context/TripContext'
import RouterViews from './router/RouterViews'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <RouterViews />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
