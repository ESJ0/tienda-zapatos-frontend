import { useState, useCallback } from 'react'
import { useFetch } from '../../hooks/useFetch'
import api from '../../api/axios'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

const EMPTY = {
  name: '', description: '', price: '', stock: '',
  size: '', color: '', brand: '', image_url: '',
  category_id: '', supplier_id: '',
}

export default function Products() {
  const { data: products,   loading, refetch }  = useFetch('/products')
  const { data: categories }                    = useFetch('/categories')
  const { data: suppliers }                     = useFetch('/suppliers')

  const [modal,  setModal]  = useState(null)   // null | 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null)
  const [form,   setForm]   = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [apiErr, setApiErr] = useState('')

  // ── Abrir modales ────────────────────────────────────────────────────────────
  const openCreate = useCallback(() => {
    setForm(EMPTY)
    setErrors({})
    setApiErr('')
    setModal('create')
  }, [])

  const openEdit = useCallback((product) => {
    setSelected(product)
    setForm({
      name:        product.name        || '',
      description: product.description || '',
      price:       product.price       || '',
      stock:       product.stock       || '',
      size:        product.size        || '',
      color:       product.color       || '',
      brand:       product.brand       || '',
      image_url:   product.image_url   || '',
      category_id: product.category_id || '',
      supplier_id: product.supplier_id || '',
    })
    setErrors({})
    setApiErr('')
    setModal('edit')
  }, [])

  const openDelete = useCallback((product) => {
    setSelected(product)
    setModal('delete')
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
    setSelected(null)
  }, [])

  // ── Validación ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!form.name.trim())       errs.name  = 'El nombre es requerido'
    if (!form.price || form.price <= 0) errs.price = 'El precio debe ser mayor a 0'
    if (form.stock === '')       errs.stock = 'El stock es requerido'
    return errs
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    setApiErr('')
    try {
      const payload = {
        ...form,
        price:       Number(form.price),
        stock:       Number(form.stock),
        size:        form.size ? Number(form.size) : 0,
        category_id: form.category_id ? Number(form.category_id) : null,
        supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
      }
      if (modal === 'create') {
        await api.post('/products', payload)
      } else {
        await api.put(`/products/${selected.id}`, payload)
      }
      await refetch()
      closeModal()
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/products/${selected.id}`)
      await refetch()
      closeModal()
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }

  // ── Columnas ─────────────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'image_url', label: 'Foto',
      render: (val) => (
        <img
          src={val || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80'}
          alt="producto"
          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2 }}
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80'}
        />
      ),
    },
    { key: 'name',  label: 'Nombre' },
    { key: 'brand', label: 'Marca' },
    {
      key: 'price', label: 'Precio',
      render: val => `Q${Number(val).toFixed(2)}`,
    },
    {
      key: 'stock', label: 'Stock',
      render: val => (
        <span style={{ color: val <= 5 ? '#ef4444' : '#111', fontWeight: val <= 5 ? 700 : 400 }}>
          {val}
        </span>
      ),
    },
    {
      key: 'category', label: 'Categoría',
      render: (_, row) => row.category?.name || '—',
    },
    {
      key: 'actions', label: 'Acciones',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>Editar</Button>
          <Button size="sm" variant="danger"  onClick={() => openDelete(row)}>Borrar</Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>PRODUCTOS</h1>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {products?.length ?? 0} productos en inventario
          </p>
        </div>
        <Button onClick={openCreate}>+ Nuevo producto</Button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p style={{ color: '#9ca3af', padding: 40, textAlign: 'center' }}>Cargando...</p>
      ) : (
        <div style={{ border: '1px solid #e5e7eb' }}>
          <Table columns={columns} data={products} emptyMessage="No hay productos" />
        </div>
      )}

      {/* Modal crear / editar */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
          onClose={closeModal}
          width={600}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input
                label="Nombre *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />
              <Input
                label="Marca"
                value={form.brand}
                onChange={e => setForm({ ...form, brand: e.target.value })}
              />
            </div>

            <Input
              label="Descripción"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Input
                label="Precio (Q) *"
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                error={errors.price}
              />
              <Input
                label="Stock *"
                type="number"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                error={errors.stock}
              />
              <Input
                label="Talla"
                type="number"
                value={form.size}
                onChange={e => setForm({ ...form, size: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input
                label="Color"
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
              />
              <Input
                label="URL Imagen"
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Categoría */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
                }}>
                  Categoría
                </label>
                <select
                  value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })}
                  style={{
                    padding: '10px 12px', border: '1px solid #e5e7eb',
                    borderRadius: 4, fontSize: 14, background: '#fff',
                  }}
                >
                  <option value="">Sin categoría</option>
                  {categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Proveedor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
                }}>
                  Proveedor
                </label>
                <select
                  value={form.supplier_id}
                  onChange={e => setForm({ ...form, supplier_id: e.target.value })}
                  style={{
                    padding: '10px 12px', border: '1px solid #e5e7eb',
                    borderRadius: 4, fontSize: 14, background: '#fff',
                  }}
                >
                  <option value="">Sin proveedor</option>
                  {suppliers?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {apiErr && (
              <div style={{
                padding: '10px 14px', background: '#fef2f2',
                border: '1px solid #fecaca', borderRadius: 4,
                fontSize: 13, color: '#dc2626',
              }}>
                {apiErr}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? 'Guardando...' : modal === 'create' ? 'Crear' : 'Guardar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal eliminar */}
      {modal === 'delete' && (
        <Modal title="Eliminar Producto" onClose={closeModal} width={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 14, color: '#374151' }}>
              ¿Estás seguro que deseas eliminar{' '}
              <strong>{selected?.name}</strong>? Esta acción no se puede deshacer.
            </p>
            {apiErr && (
              <div style={{
                padding: '10px 14px', background: '#fef2f2',
                border: '1px solid #fecaca', borderRadius: 4,
                fontSize: 13, color: '#dc2626',
              }}>
                {apiErr}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button variant="danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}