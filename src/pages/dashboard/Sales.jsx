import { useState, useCallback } from 'react'
import { useFetch } from '../../hooks/useFetch'
import api from '../../api/axios'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

export default function Sales() {
  const { data: sales,     loading, refetch } = useFetch('/sales')
  const { data: customers }                   = useFetch('/customers')
  const { data: employees }                   = useFetch('/employees')
  const { data: products }                    = useFetch('/products')

  const [modal,    setModal]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [apiErr,   setApiErr]   = useState('')

  // ── Form nueva venta ──────────────────────────────────────────────────────
  const [saleForm, setSaleForm] = useState({
    customer_id: '',
    employee_id: '',
    notes: '',
  })
  const [items,    setItems]    = useState([])   // { product_id, quantity, unit_price, name }
  const [formErr,  setFormErr]  = useState({})

  const openCreate = useCallback(() => {
    setSaleForm({ customer_id: '', employee_id: '', notes: '' })
    setItems([])
    setFormErr({})
    setApiErr('')
    setModal('create')
  }, [])

  const openDetail = useCallback((sale) => {
    setSelected(sale)
    setModal('detail')
  }, [])

  const openDelete = useCallback((sale) => {
    setSelected(sale)
    setModal('delete')
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
    setSelected(null)
  }, [])

  // ── Manejo de items ───────────────────────────────────────────────────────
  const addItem = () => {
    setItems(prev => [...prev, { product_id: '', quantity: 1, unit_price: 0, name: '' }])
  }

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const updateItem = (idx, field, value) => {
    setItems(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }

      // Auto-completar precio cuando se elige producto
      if (field === 'product_id') {
        const prod = products?.find(p => p.id === Number(value))
        if (prod) {
          next[idx].unit_price = prod.price
          next[idx].name       = prod.name
        }
      }
      return next
    })
  }

  const saleTotal = items.reduce((sum, i) => sum + (Number(i.unit_price) * Number(i.quantity)), 0)

  // ── Validación ────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!saleForm.customer_id) errs.customer_id = 'El cliente es requerido'
    if (!saleForm.employee_id) errs.employee_id = 'El empleado es requerido'
    if (items.length === 0)    errs.items = 'Agrega al menos un producto'
    items.forEach((item, i) => {
      if (!item.product_id)      errs[`item_${i}_product`]  = 'Elige un producto'
      if (item.quantity <= 0)    errs[`item_${i}_qty`]      = 'Cantidad inválida'
      if (item.unit_price <= 0)  errs[`item_${i}_price`]    = 'Precio inválido'
    })
    return errs
  }

  // ── Crear venta ───────────────────────────────────────────────────────────
  const handleCreate = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFormErr(errs); return }
    setSaving(true); setApiErr('')
    try {
      await api.post('/sales', {
        customer_id: Number(saleForm.customer_id),
        employee_id: Number(saleForm.employee_id),
        notes:       saleForm.notes,
        items: items.map(i => ({
          product_id: Number(i.product_id),
          quantity:   Number(i.quantity),
          unit_price: Number(i.unit_price),
        })),
      })
      await refetch()
      closeModal()
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Error al crear venta')
    } finally {
      setSaving(false)
    }
  }

  // ── Anular venta ──────────────────────────────────────────────────────────
  const handleCancel = async () => {
    setSaving(true)
    try {
      await api.delete(`/sales/${selected.id}`)
      await refetch()
      closeModal()
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Error al anular')
    } finally {
      setSaving(false)
    }
  }

  // ── Columnas ──────────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'id', label: '# Venta',
      render: val => (
        <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
          #{String(val).padStart(4, '0')}
        </span>
      ),
    },
    {
      key: 'sale_date', label: 'Fecha',
      render: val => new Date(val).toLocaleDateString('es-GT'),
    },
    {
      key: 'customer', label: 'Cliente',
      render: (_, row) => row.customer
        ? `${row.customer.first_name} ${row.customer.last_name}`
        : '—',
    },
    {
      key: 'employee', label: 'Empleado',
      render: (_, row) => row.employee
        ? `${row.employee.first_name} ${row.employee.last_name}`
        : '—',
    },
    {
      key: 'total', label: 'Total',
      render: val => (
        <span style={{ fontWeight: 700 }}>Q{Number(val).toFixed(2)}</span>
      ),
    },
    {
      key: 'status', label: 'Estado',
      render: val => <Badge status={val} />,
    },
    {
      key: 'actions', label: 'Acciones',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={() => openDetail(row)}>
            Ver
          </Button>
          {row.status !== 'anulada' && (
            <Button size="sm" variant="danger" onClick={() => openDelete(row)}>
              Anular
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>VENTAS</h1>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {sales?.length ?? 0} transacciones registradas
          </p>
        </div>
        <Button onClick={openCreate}>+ Nueva venta</Button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p style={{ color: '#9ca3af', padding: 40, textAlign: 'center' }}>Cargando...</p>
      ) : (
        <div style={{ border: '1px solid #e5e7eb' }}>
          <Table columns={columns} data={sales} emptyMessage="No hay ventas registradas" />
        </div>
      )}

      {/* ── Modal crear venta ──────────────────────────────────────────────── */}
      {modal === 'create' && (
        <Modal title="Nueva Venta" onClose={closeModal} width={680}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Cliente y Empleado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
                }}>
                  Cliente *
                </label>
                <select
                  value={saleForm.customer_id}
                  onChange={e => setSaleForm({ ...saleForm, customer_id: e.target.value })}
                  style={{
                    padding: '10px 12px', border: `1px solid ${formErr.customer_id ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: 4, fontSize: 14, background: '#fff',
                  }}
                >
                  <option value="">Seleccionar...</option>
                  {customers?.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}
                    </option>
                  ))}
                </select>
                {formErr.customer_id && (
                  <span style={{ fontSize: 11, color: '#ef4444' }}>{formErr.customer_id}</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
                }}>
                  Empleado *
                </label>
                <select
                  value={saleForm.employee_id}
                  onChange={e => setSaleForm({ ...saleForm, employee_id: e.target.value })}
                  style={{
                    padding: '10px 12px', border: `1px solid ${formErr.employee_id ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: 4, fontSize: 14, background: '#fff',
                  }}
                >
                  <option value="">Seleccionar...</option>
                  {employees?.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.first_name} {e.last_name}
                    </option>
                  ))}
                </select>
                {formErr.employee_id && (
                  <span style={{ fontSize: 11, color: '#ef4444' }}>{formErr.employee_id}</span>
                )}
              </div>
            </div>

            <Input
              label="Notas"
              value={saleForm.notes}
              onChange={e => setSaleForm({ ...saleForm, notes: e.target.value })}
            />

            {/* Items */}
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12,
              }}>
                <label style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
                }}>
                  Productos *
                </label>
                <Button size="sm" variant="outline" onClick={addItem}>+ Agregar</Button>
              </div>

              {formErr.items && (
                <p style={{ fontSize: 11, color: '#ef4444', marginBottom: 8 }}>{formErr.items}</p>
              )}

              {items.length === 0 ? (
                <div style={{
                  padding: '24px', textAlign: 'center',
                  border: '1px dashed #e5e7eb', color: '#9ca3af', fontSize: 13,
                }}>
                  Agrega productos a la venta
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 80px 100px auto',
                        gap: 10, alignItems: 'center',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 4,
                      }}
                    >
                      {/* Producto */}
                      <select
                        value={item.product_id}
                        onChange={e => updateItem(idx, 'product_id', e.target.value)}
                        style={{
                          padding: '8px 10px',
                          border: `1px solid ${formErr[`item_${idx}_product`] ? '#ef4444' : '#e5e7eb'}`,
                          borderRadius: 4, fontSize: 13, background: '#fff',
                        }}
                      >
                        <option value="">Producto...</option>
                        {products?.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>

                      {/* Cantidad */}
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateItem(idx, 'quantity', e.target.value)}
                        placeholder="Cant."
                        style={{
                          padding: '8px 10px',
                          border: `1px solid ${formErr[`item_${idx}_qty`] ? '#ef4444' : '#e5e7eb'}`,
                          borderRadius: 4, fontSize: 13,
                        }}
                      />

                      {/* Precio */}
                      <input
                        type="number"
                        min={0}
                        value={item.unit_price}
                        onChange={e => updateItem(idx, 'unit_price', e.target.value)}
                        placeholder="Precio"
                        style={{
                          padding: '8px 10px',
                          border: `1px solid ${formErr[`item_${idx}_price`] ? '#ef4444' : '#e5e7eb'}`,
                          borderRadius: 4, fontSize: 13,
                        }}
                      />

                      {/* Subtotal + borrar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Q{(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(idx)}
                          style={{
                            background: 'none', border: 'none',
                            color: '#ef4444', cursor: 'pointer', fontSize: 16,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              {items.length > 0 && (
                <div style={{
                  display: 'flex', justifyContent: 'flex-end',
                  marginTop: 12, paddingTop: 12,
                  borderTop: '1px solid #e5e7eb',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>
                    Total: Q{saleTotal.toFixed(2)}
                  </span>
                </div>
              )}
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

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? 'Procesando...' : 'Confirmar venta'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal detalle venta ────────────────────────────────────────────── */}
      {modal === 'detail' && selected && (
        <Modal title={`Venta #${String(selected.id).padStart(4,'0')}`} onClose={closeModal} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <InfoRow label="Fecha"    value={new Date(selected.sale_date).toLocaleDateString('es-GT')} />
              <InfoRow label="Estado"   value={<Badge status={selected.status} />} />
              <InfoRow label="Cliente"  value={selected.customer ? `${selected.customer.first_name} ${selected.customer.last_name}` : '—'} />
              <InfoRow label="Empleado" value={selected.employee ? `${selected.employee.first_name} ${selected.employee.last_name}` : '—'} />
            </div>

            {selected.notes && (
              <InfoRow label="Notas" value={selected.notes} />
            )}

            {/* Items */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#6b7280', marginBottom: 10,
              }}>
                Productos
              </div>
              {selected.items?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selected.items.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      fontSize: 13,
                    }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.product?.name || `Producto #${item.product_id}`}</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                          {item.quantity} × Q{Number(item.unit_price).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        Q{Number(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: '#9ca3af' }}>Sin detalle disponible</p>
              )}
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end',
              paddingTop: 12, borderTop: '1px solid #e5e7eb',
            }}>
              <span style={{ fontSize: 18, fontWeight: 800 }}>
                Total: Q{Number(selected.total).toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={closeModal}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal anular venta ─────────────────────────────────────────────── */}
      {modal === 'delete' && selected && (
        <Modal title="Anular Venta" onClose={closeModal} width={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 14, color: '#374151' }}>
              ¿Anular la venta{' '}
              <strong>#{String(selected.id).padStart(4,'0')}</strong> por{' '}
              <strong>Q{Number(selected.total).toFixed(2)}</strong>?
              Esta acción no se puede deshacer.
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
              <Button variant="danger" onClick={handleCancel} disabled={saving}>
                {saving ? 'Anulando...' : 'Anular venta'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
      }}>
        {label}
      </span>
      <span style={{ fontSize: 13 }}>{value}</span>
    </div>
  )
}