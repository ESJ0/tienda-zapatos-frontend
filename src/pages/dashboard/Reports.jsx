import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { exportToCsv } from '../../utils/exportCsv'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const BLUES = ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

export default function Reports() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')
  const [activeTab, setActiveTab] = useState('sales')

  const salesUrl = `/reports/sales-total${dateFrom ? `?from=${dateFrom}${dateTo ? `&to=${dateTo}` : ''}` : dateTo ? `?to=${dateTo}` : ''}`

  const { data: salesTotal,  refetch: refetchSales } = useFetch(salesUrl)
  const { data: topProducts }                        = useFetch('/reports/top-products?limit=10')
  const { data: stockReport }                        = useFetch('/reports/stock')
  const { data: byEmployee }                         = useFetch('/reports/sales-by-employee')

  // ── Datos para gráficas ───────────────────────────────────────────────────

  const barData = (topProducts || []).map(p => ({
    name:     p.product_name.split(' ').slice(0, 2).join(' '),
    vendidos: p.total_sold,
    ingresos: Number(p.total_revenue),
  }))

  const pieData = (byEmployee || [])
    .filter(e => e.total_amount > 0)
    .map(e => ({
      name:  e.employee_name.split(' ')[0],
      value: Number(e.total_amount),
    }))

  const stockBar = (stockReport || [])
    .slice(0, 10)
    .map(p => ({
      name:  p.product_name.split(' ').slice(0, 2).join(' '),
      stock: p.stock,
    }))

  // ── Exportar CSV ──────────────────────────────────────────────────────────

  const handleExportSales = () => {
    if (!byEmployee) return
    exportToCsv(
      byEmployee.map(e => ({
        Empleado:      e.employee_name,
        'Nº Ventas':   e.total_sales,
        'Total (Q)':   Number(e.total_amount).toFixed(2),
      })),
      'reporte-ventas-empleado'
    )
  }

  const handleExportStock = () => {
    if (!stockReport) return
    exportToCsv(
      stockReport.map(p => ({
        Producto: p.product_name,
        Marca:    p.brand,
        Stock:    p.stock,
        'Precio (Q)': Number(p.price).toFixed(2),
      })),
      'reporte-stock'
    )
  }

  const handleExportTopProducts = () => {
    if (!topProducts) return
    exportToCsv(
      topProducts.map(p => ({
        Producto:        p.product_name,
        Marca:           p.brand,
        'Unidades vendidas': p.total_sold,
        'Ingresos (Q)':  Number(p.total_revenue).toFixed(2),
      })),
      'reporte-top-productos'
    )
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────

  const tabs = [
    { key: 'sales',    label: 'Ventas'    },
    { key: 'products', label: 'Productos' },
    { key: 'stock',    label: 'Stock'     },
  ]

  const tabStyle = (key) => ({
    padding: '10px 20px',
    fontSize: 10, fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    border: 'none', cursor: 'pointer',
    background: activeTab === key ? '#111' : 'transparent',
    color:      activeTab === key ? '#fff' : '#6b7280',
    borderBottom: activeTab === key ? '2px solid #111' : '2px solid transparent',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>REPORTES</h1>
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          Análisis y exportación de datos
        </p>
      </div>

      {/* ── Panel de ventas con filtro de fecha ─────────────────────────── */}
      <div style={{ border: '1px solid #e5e7eb', padding: 24 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#6b7280', marginBottom: 4,
            }}>
              Resumen de ventas
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              Filtrar por rango de fechas
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280',
              }}>
                Desde
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                style={{
                  padding: '8px 10px', border: '1px solid #e5e7eb',
                  borderRadius: 4, fontSize: 13,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280',
              }}>
                Hasta
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                style={{
                  padding: '8px 10px', border: '1px solid #e5e7eb',
                  borderRadius: 4, fontSize: 13,
                }}
              />
            </div>
            <Button onClick={refetchSales}>Aplicar</Button>
          </div>
        </div>

        {/* Stat cards inline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16 }}>
          {[
            {
              label: 'Total ventas',
              value: salesTotal?.total_sales ?? '—',
            },
            {
              label: 'Ingresos totales',
              value: salesTotal ? `Q${Number(salesTotal.total_amount).toLocaleString('es-GT', { minimumFractionDigits: 2 })}` : '—',
            },
          ].map(card => (
            <div key={card.label} style={{
              border: '1px solid #e5e7eb', padding: '20px 24px',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#6b7280', marginBottom: 10,
              }}>
                {card.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Ventas por empleado ───────────────────────────────────── */}
        {activeTab === 'sales' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={handleExportSales}>
                Exportar CSV
              </Button>
            </div>

            {/* Pie chart */}
            <div style={{ border: '1px solid #e5e7eb', padding: 24 }}>
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#6b7280', marginBottom: 16,
              }}>
                Distribución de ingresos por empleado
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={BLUES[i % BLUES.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={val => [`Q${Number(val).toFixed(2)}`, 'Ingresos']}
                    contentStyle={{ border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla empleados */}
            <div style={{ border: '1px solid #e5e7eb' }}>
              <Table
                columns={[
                  { key: 'employee_name', label: 'Empleado' },
                  { key: 'total_sales',   label: 'Nº Ventas' },
                  {
                    key: 'total_amount', label: 'Ingresos',
                    render: val => (
                      <span style={{ fontWeight: 700 }}>
                        Q{Number(val).toFixed(2)}
                      </span>
                    ),
                  },
                ]}
                data={byEmployee}
                emptyMessage="Sin datos"
              />
            </div>
          </div>
        )}

        {/* ── Tab: Top productos ─────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={handleExportTopProducts}>
                Exportar CSV
              </Button>
            </div>

            {/* Bar chart */}
            <div style={{ border: '1px solid #e5e7eb', padding: 24 }}>
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#6b7280', marginBottom: 16,
              }}>
                Unidades vendidas por producto
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-30}
                    textAnchor="end"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                  <Bar dataKey="vendidos" radius={[2,2,0,0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={BLUES[i % BLUES.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla */}
            <div style={{ border: '1px solid #e5e7eb' }}>
              <Table
                columns={[
                  { key: 'product_name', label: 'Producto' },
                  { key: 'brand',        label: 'Marca' },
                  { key: 'total_sold',   label: 'Unidades vendidas' },
                  {
                    key: 'total_revenue', label: 'Ingresos',
                    render: val => `Q${Number(val).toFixed(2)}`,
                  },
                ]}
                data={topProducts}
                emptyMessage="Sin datos"
              />
            </div>
          </div>
        )}

        {/* ── Tab: Stock ─────────────────────────────────────────────────── */}
        {activeTab === 'stock' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={handleExportStock}>
                Exportar CSV
              </Button>
            </div>

            {/* Bar chart stock */}
            <div style={{ border: '1px solid #e5e7eb', padding: 24 }}>
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#6b7280', marginBottom: 16,
              }}>
                Stock disponible — top 10
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stockBar} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-30}
                    textAnchor="end"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                  <Bar dataKey="stock" radius={[2,2,0,0]}>
                    {stockBar.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.stock <= 5 ? '#ef4444' : BLUES[i % BLUES.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 11, color: '#6b7280', marginTop: 8 }}>
                * Barras en rojo indican stock crítico (≤5 unidades)
              </p>
            </div>

            {/* Tabla */}
            <div style={{ border: '1px solid #e5e7eb' }}>
              <Table
                columns={[
                  { key: 'product_name', label: 'Producto' },
                  { key: 'brand',        label: 'Marca' },
                  {
                    key: 'stock', label: 'Stock',
                    render: val => (
                      <span style={{
                        fontWeight: 700,
                        color: val <= 5 ? '#ef4444' : '#111',
                      }}>
                        {val}
                      </span>
                    ),
                  },
                  {
                    key: 'price', label: 'Precio',
                    render: val => `Q${Number(val).toFixed(2)}`,
                  },
                ]}
                data={stockReport}
                emptyMessage="Sin datos"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}