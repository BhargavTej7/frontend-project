import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { useAppContext } from './context/AppContext.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Auth from './pages/Auth.jsx'
import BuyerMarketplace from './pages/BuyerMarketplace.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import Insights from './pages/Insights.jsx'
import Landing from './pages/Landing.jsx'
import Resources from './pages/Resources.jsx'
import Stories from './pages/Stories.jsx'
import './App.css'

const RoleGuard = ({ allowRoles, children }) => {
  const { currentUser } = useAppContext()

  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }

  if (allowRoles && !allowRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

const App = () => {
  const { currentUser } = useAppContext()

  const defaultRedirect = (() => {
    if (!currentUser) return '/'
    if (currentUser.role === 'admin') return '/admin'
    if (currentUser.role === 'farmer') return '/farmer'
    return '/marketplace'
  })()

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/auth"
            element={
              currentUser ? <Navigate to={defaultRedirect} replace /> : <Auth />
            }
          />
          <Route
            path="/admin"
            element={
              <RoleGuard allowRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/farmer"
            element={
              <RoleGuard allowRoles={['farmer']}>
                <FarmerDashboard />
              </RoleGuard>
            }
          />
          <Route path="/marketplace" element={<BuyerMarketplace />} />
          <Route
            path="/insights"
            element={
              <RoleGuard allowRoles={['admin', 'farmer']}>
                <Insights />
              </RoleGuard>
            }
          />
          <Route
            path="/resources"
            element={
              <RoleGuard allowRoles={['farmer']}>
                <Resources />
              </RoleGuard>
            }
          />
          <Route path="/stories" element={<Stories />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>
          Built for FEDF-PS01 &mdash; Empowering rural entrepreneurship with value-added agriculture.
        </p>
        <p>
          © {new Date().getFullYear()} AgriValue Exchange. Connecting farmers and global buyers.
        </p>
      </footer>
    </div>
  )
}

export default App
