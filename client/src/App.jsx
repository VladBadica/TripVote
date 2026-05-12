import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RouterViews from './router/RouterViews'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterViews />
      </AuthProvider>
    </BrowserRouter>
  )
}
