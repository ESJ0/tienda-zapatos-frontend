import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken]   = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const login = useCallback(async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { username, password })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        ...data.user,
        employee: data.employee,
      }))

      setToken(data.token)
      setUser({ ...data.user, employee: data.employee })
      return true
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  // El rol viene del employee ligado al usuario
  const isAdmin = user?.employee?.role === 'administrador'

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}