import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/ui/StatCard'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'

export default function Overview() {
  const { user }                      = useAuth()
  const { data: salesTotal }          = useFetch('/reports/sales-total')
  const { data: stock }               = useFetch('/reports/stock')
  const { data: topProducts }         = useFetch('/reports/top-products?limit=6')
  const { data: byEmployee }          = useFetch('/reports/sales-by-employee')
  const { data: sales }               = useFetch('/reports/sales-total')

  // Stock bajo (≤5)
  const lowStock = stock?.filter(p => p.stock <= 5).length ?? 0

  // Top categoría desde topProducts
  const topProduct = topProducts?.[0]?.product_name ?? '—'

  // Datos para gráfica de barras — top productos
  const barData = (topProducts || []).map(p => ({
    name: p.product_name.split(' ').slice(0,2).join(' '),
    vendidos: p.total_sold,
    ingresos: Number(p.total_revenue),
  }))

  // Datos para gráfica de línea — ventas por empleado
  const lineData = (byEmployee || []).map(e => ({
    name: e.employee_name.split(' ')[0],
    ventas: e.total_sales,
    total: Number(e.total_amount),
  }))

  const BLUES = ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Saludo */}
      <div>
        <h1 style={{
          fontSize: 22, fontWeight: 800,
          letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          OPERATIONAL OVERVIEW
        </h1>
        <p style={{ fontSize: 12, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Bienvenido, {user?.employee?.first_name} · Real-time store performance
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        <StatCard
          title="Total Ventas"
          value={salesTotal?.total_sales ?? '—'}
          sub="Ventas completadas"
          icon="🧾"
        />
        <StatCard
          title="Ingresos Totales"
          value={salesTotal ? `Q${Number(salesTotal.total_amount).toLocaleString()}` : '—'}
          sub="Sin ventas anuladas"
          icon="💰"
        />
        <StatCard
          title="Stock Bajo"
          value={<span style={{ color: lowStock > 0 ? '#ef4444' : '#22c55e' }}>{lowStock}</span>}
          sub="Productos con ≤5 unidades"
          icon="⚠️"
        />
        <StatCard
          title="Producto Top"
          value={<span style={{ fontSize: 16 }}>{topProduct}</span>}
          sub="Más vendido"
          icon="📈"
        />
      </div>

      {/* Gráficas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Barras — top productos */}
        <div style={{ border: '1px solid #e5e7eb', padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#6b7280', marginBottom: 4,
            }}>
              Top Productos
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Unidades vendidas</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="vendidos" fill="#1d4ed8" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Línea — ventas por empleado */}
        <div style={{ border: '1px solid #e5e7eb', padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#6b7280', marginBottom: 4,
            }}>
              Por Empleado
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Ventas e ingresos</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={lineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
              <Bar dataKey="ventas"  fill="#3b82f6" radius={[2,2,0,0]} name="Ventas" />
              <Bar dataKey="total"   fill="#93c5fd" radius={[2,2,0,0]} name="Ingresos Q" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Proveedores',  desc: 'Gestionar socios y contratos',     icon: '🏭' },
          { label: 'Empleados',    desc: 'Directorio y permisos de acceso',   icon: '👥' },
          { label: 'Reportes',     desc: 'Exportar datos y análisis',         icon: '📊' },
          { label: 'Inventario',   desc: 'Stock disponible en tiempo real',   icon: '📦' },
        ].map(item => (
          <div
            key={item.label}
            style={{
              border: '1px solid #e5e7eb',
              padding: '20px 24px',
              display: 'flex', flexDirection: 'column', gap: 8,
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {item.label}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{item.desc}</div>
          </div>
        ))}
      </div>

    </div>
  )
}