import { useState, useMemo, useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/catalog/ProductCard'
import ProductFilters from '../components/catalog/ProductFilters'

const DEFAULT_FILTERS = {
  search: '',
  category_id: '',
  maxPrice: 3000,
  sort: 'newest',
}

export default function Catalog() {
  const { data: products, loading } = useFetch('/products')
  const { data: categories }        = useFetch('/categories')
  const [filters, setFilters]       = useState(DEFAULT_FILTERS)

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  // useMemo: filtrar y ordenar solo cuando cambian productos o filtros
  const filtered = useMemo(() => {
    if (!products) return []
    let list = [...products]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q)
      )
    }

    if (filters.category_id) {
      list = list.filter(p => p.category_id === Number(filters.category_id))
    }

    list = list.filter(p => Number(p.price) <= filters.maxPrice)

    switch (filters.sort) {
      case 'price_asc':  list.sort((a,b) => a.price - b.price); break
      case 'price_desc': list.sort((a,b) => b.price - a.price); break
      case 'name':       list.sort((a,b) => a.name.localeCompare(b.name)); break
      default:           list.sort((a,b) => b.id - a.id)
    }

    return list
  }, [products, filters])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: 32, fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: 6,
          }}>
            CATÁLOGO
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>
            {loading ? 'Cargando...' : `${filtered.length} productos`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
          {/* Filtros */}
          <ProductFilters
            filters={filters}
            onChange={handleFilterChange}
            categories={categories}
          />

          {/* Grid */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>
                Cargando productos...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>
                No se encontraron productos.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 24,
              }}>
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}