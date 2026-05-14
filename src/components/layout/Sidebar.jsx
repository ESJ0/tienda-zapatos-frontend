import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/dashboard',           label: 'Overview',    icon: '▦' },
  { to: '/dashboard/products',  label: 'Productos',   icon: '👟' },
  { to: '/dashboard/sales',     label: 'Ventas',      icon: '🧾' },
  { to: '/dashboard/customers', label: 'Clientes',    icon: '👤' },
  { to: '/dashboard/employees', label: 'Empleados',   icon: '👥' },
  { to: '/dashboard/reports',   label: 'Reportes',    icon: '📊' },
]

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 800, fontSize: 16,
        letterSpacing: '-0.02em',
      }}>
        ESJ0
      </div>

      {/* User info */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>
          {user?.employee?.first_name} {user?.employee?.last_name}
        </div>
        <div style={{
          fontSize: 10, color: '#6b7280',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2,
        }}>
          {user?.employee?.role || 'usuario'}
        </div>
        {isAdmin && (
          <span style={{
            display: 'inline-block', marginTop: 6,
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: '#111', color: '#fff',
            padding: '2px 6px', borderRadius: 2,
          }}>
            Admin
          </span>
        )}
      </div>

      {/* Links */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 24px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isActive ? '#111' : '#6b7280',
              background: isActive ? '#f9fafb' : 'transparent',
              borderLeft: isActive ? '2px solid #111' : '2px solid transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: 14 }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '8px',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            background: 'none', border: '1px solid #e5e7eb',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#111'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = '#111'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = '#111'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}