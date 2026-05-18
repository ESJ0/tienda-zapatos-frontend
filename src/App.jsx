import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './routes/ProtectedRoute'

// Pages
import Login    from './pages/Login'

// Dashboard pages
import Overview   from './pages/dashboard/Overview'
import Products   from './pages/dashboard/Products'
import Sales      from './pages/dashboard/Sales'
import Customers  from './pages/dashboard/Customers'
import Employees  from './pages/dashboard/Employees'
import Reports    from './pages/dashboard/Reports'

// Dashboard layout
import Sidebar from './components/layout/Sidebar'

function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        padding: '40px 48px',
        background: '#fff',
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  )
}

function HomeRedirect() {
  const { token } = useAuth()
  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>

            {/* ── Públicas ────────────────────────────────────────────── */}
            <Route path="/login"   element={<Login />} />
            <Route path="/"        element={<HomeRedirect />} />

            {/* ── Protegidas ──────────────────────────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <DashboardLayout>
                    <Overview />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/products"
                element={
                  <DashboardLayout>
                    <Products />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/sales"
                element={
                  <DashboardLayout>
                    <Sales />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/customers"
                element={
                  <DashboardLayout>
                    <Customers />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/employees"
                element={
                  <DashboardLayout>
                    <Employees />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/reports"
                element={
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                }
              />
            </Route>

            {/* ── Fallback ────────────────────────────────────────────── */}
            <Route path="*" element={<HomeRedirect />} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  )
}
