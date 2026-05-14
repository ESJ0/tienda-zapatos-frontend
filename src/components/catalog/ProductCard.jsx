import { useCart } from '../../context/CartContext'

const FALLBACK = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'

export default function ProductCard({ product }) {
  const { addItem, items } = useCart()

  const inCart = items.some(i => i.id === product.id)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e5e7eb',
      transition: 'box-shadow 0.2s',
      background: '#fff',
      cursor: 'pointer',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Imagen */}
      <div style={{
        aspectRatio: '4/3',
        overflow: 'hidden',
        background: '#f9fafb',
      }}>
        <img
          src={product.image_url || FALLBACK}
          alt={product.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = FALLBACK }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{
          fontSize: 10, color: '#6b7280',
          letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          {product.brand || product.category?.name || '—'}
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
          {product.name}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            Q{Number(product.price).toFixed(2)}
          </span>
          <span style={{ fontSize: 10, color: product.stock > 0 ? '#6b7280' : '#ef4444' }}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>

        {product.size && (
          <div style={{ fontSize: 11, color: '#9ca3af' }}>
            Talla: {product.size} · {product.color}
          </div>
        )}

        {/* Botón agregar */}
        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          style={{
            marginTop: 8,
            padding: '9px',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            background: inCart ? '#f4f4f4' : '#111',
            color: inCart ? '#111' : '#fff',
            border: '1px solid #111',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            opacity: product.stock === 0 ? 0.4 : 1,
            transition: 'all 0.15s',
          }}
        >
          {inCart ? '✓ En carrito' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}