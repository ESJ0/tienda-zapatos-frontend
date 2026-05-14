import { useMemo } from 'react'

export default function ProductFilters({ filters, onChange, categories }) {
  const categoryOptions = useMemo(() =>
    categories?.map(c => ({ value: c.id, label: c.name })) || [],
    [categories]
  )

  const labelStyle = {
    fontSize: 10, fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: '#6b7280', display: 'block', marginBottom: 10,
  }

  const selectStyle = {
    width: '100%', padding: '8px 10px',
    border: '1px solid #e5e7eb', borderRadius: 4,
    fontSize: 13, background: '#fff',
    cursor: 'pointer', outline: 'none',
  }

  const inputStyle = {
    width: '100%', padding: '8px 10px',
    border: '1px solid #e5e7eb', borderRadius: 4,
    fontSize: 13, outline: 'none',
  }

  return (
    <aside style={{
      width: 200,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
    }}>
      {/* Búsqueda */}
      <div>
        <label style={labelStyle}>Búsqueda</label>
        <input
          style={inputStyle}
          placeholder="Nombre o marca..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          onFocus={e => e.target.style.borderColor = '#111'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
      </div>

      {/* Categoría */}
      <div>
        <label style={labelStyle}>Categoría</label>
        <select
          style={selectStyle}
          value={filters.category_id}
          onChange={e => onChange({ ...filters, category_id: e.target.value })}
        >
          <option value="">Todas</option>
          {categoryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div>
        <label style={labelStyle}>Precio máximo</label>
        <input
          type="range"
          min={0} max={3000} step={50}
          value={filters.maxPrice}
          onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#111' }}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: '#6b7280', marginTop: 6,
        }}>
          <span>Q0</span>
          <span>Q{filters.maxPrice}</span>
        </div>
      </div>

      {/* Ordenar */}
      <div>
        <label style={labelStyle}>Ordenar por</label>
        <select
          style={selectStyle}
          value={filters.sort}
          onChange={e => onChange({ ...filters, sort: e.target.value })}
        >
          <option value="newest">Más reciente</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="name">Nombre A-Z</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ search: '', category_id: '', maxPrice: 3000, sort: 'newest' })}
        style={{
          padding: '9px',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          background: '#111', color: '#fff',
          border: 'none', cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#333'}
        onMouseLeave={e => e.currentTarget.style.background = '#111'}
      >
        Reset filtros
      </button>
    </aside>
  )
}