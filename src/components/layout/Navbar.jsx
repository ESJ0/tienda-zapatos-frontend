import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { token, logout } = useAuth()
  const { itemCount }     = useCart()
  const navigate          = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      borderBottom: '1px solid #e5e7eb',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
          ESJ0
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <NavLink to="/">Catálogo</NavLink>
          {token && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>

        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Carrito */}
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', position: 'relative',
              fontSize: 18, padding: 4,
            }}
            title="Carrito"
          >
            🛒
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#111', color: '#fff',
                borderRadius: '50%', fontSize: 9, fontWeight: 700,
                width: 16, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {itemCount}
              </span>
            )}
          </button>

          {token ? (
            <button
              onClick={handleLogout}
              style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: 'none', border: '1px solid #e5e7eb',
                padding: '6px 14px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.target.style.background = '#111'
                e.target.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.target.style.background = 'none'
                e.target.style.color = '#111'
              }}
            >
              Salir
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                border: '1px solid #111',
                padding: '6px 14px',
                transition: 'all 0.15s',
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        fontSize: 11, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: '#111', transition: 'color 0.15s',
      }}
      onMouseEnter={e => e.target.style.color = '#6b7280'}
      onMouseLeave={e => e.target.style.color = '#111'}
    >
      {children}
    </Link>
  )
}