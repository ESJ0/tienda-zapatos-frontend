import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading, error, token } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Si ya tiene sesión, redirigir
  useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token, navigate])

  const validate = () => {
    const errs = {}
    if (!username.trim()) errs.username = 'El usuario es requerido'
    if (!password.trim()) errs.password = 'La contraseña es requerida'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    const ok = await login(username, password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#fff',
    }}>
      {/* Panel izquierdo — decorativo */}
      <div style={{
        flex: 1,
        background: '#111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 48,
        color: '#fff',
      }}
        className="hide-mobile"
      >
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
          ESJ0
        </div>
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#9ca3af', marginBottom: 16,
          }}>
            Gestión de tienda
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
            Control total<br />de tu inventario<br />y ventas.
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>
          © {new Date().getFullYear()} ESJ0 FOOTWEAR
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 56px',
      }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 8, color: '#6b7280',
          }}>
            Bienvenido
          </h1>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Iniciar sesión
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Username */}
          <div>
            <label style={{
              display: 'block', marginBottom: 6,
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
            }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              style={{
                width: '100%', padding: '12px 14px',
                border: `1px solid ${fieldErrors.username ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: 4, fontSize: 14, outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#111'}
              onBlur={e => e.target.style.borderColor = fieldErrors.username ? '#ef4444' : '#e5e7eb'}
            />
            {fieldErrors.username && (
              <span style={{ fontSize: 11, color: '#ef4444', marginTop: 4, display: 'block' }}>
                {fieldErrors.username}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', marginBottom: 6,
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                width: '100%', padding: '12px 14px',
                border: `1px solid ${fieldErrors.password ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: 4, fontSize: 14, outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#111'}
              onBlur={e => e.target.style.borderColor = fieldErrors.password ? '#ef4444' : '#e5e7eb'}
            />
            {fieldErrors.password && (
              <span style={{ fontSize: 11, color: '#ef4444', marginTop: 4, display: 'block' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Error global */}
          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 4, fontSize: 13, color: '#dc2626',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '13px',
              background: '#111', color: '#fff',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#333' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#111' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar →'}
          </button>
        </form>

      </div>
    </div>
  )
}