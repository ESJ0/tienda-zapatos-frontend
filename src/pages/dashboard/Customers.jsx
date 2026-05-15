import { useState, useCallback } from 'react'
import { useFetch } from '../../hooks/useFetch'
import api from '../../api/axios'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

const EMPTY = { first_name: '', last_name: '', email: '', phone: '', address: '' }

export default function Customers() {
  const { data: customers, loading, refetch } = useFetch('/customers')

  const [modal,    setModal]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [form,     setForm]     = useState(EMPTY)
  const [errors,   setErrors]   = useState({})
  const [saving,   setSaving]   = useState(false)
  const [apiErr,   setApiErr]   = useState('')

  const openCreate = useCallback(() => {
    setForm(EMPTY); setErrors({}); setApiErr(''); setModal('create')
  }, [])

  const openEdit = useCallback((c) => {
    setSelected(c)
    setForm({
      first_name: c.first_name || '',
      last_name:  c.last_name  || '',
      email:      c.email      || '',
      phone:      c.phone      || '',
      address:    c.address    || '',
    })
    setErrors({}); setApiErr(''); setModal('edit')
  }, [])

  const openDelete = useCallback((c) => {
    setSelected(c); setModal('delete')
  }, [])

  const closeModal = useCallback(() => {
    setModal(null); setSelected(null)
  }, [])

  const validate = () => {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'El nombre es requerido'
    if (!form.last_name.trim())  errs.last_name  = 'El apellido es requerido'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true); setApiErr('')
    try {
      if (modal === 'create') {
        await api.post('/customers', form)
      } else {
        await api.put(`/customers/${selected.id}`, form)
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
      await api.delete(`/customers/${selected.id}`)
      await refetch()
      closeModal()
    } catch (err) {
      setApiErr(err.response?.data?.error || 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'first_name', label: 'Nombre' },
    { key: 'last_name',  label: 'Apellido' },
    { key: 'email',      label: 'Email' },
    { key: 'phone',      label: 'Teléfono' },
    { key: 'address',    label: 'Dirección' },
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
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>CLIENTES</h1>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {customers?.length ?? 0} clientes registrados
          </p>
        </div>
        <Button onClick={openCreate}>+ Nuevo cliente</Button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p style={{ color: '#9ca3af', padding: 40, textAlign: 'center' }}>Cargando...</p>
      ) : (
        <div style={{ border: '1px solid #e5e7eb' }}>
          <Table columns={columns} data={customers} emptyMessage="No hay clientes" />
        </div>
      )}

      {/* Modal crear / editar */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
          onClose={closeModal}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input
                label="Nombre *"
                value={form.first_name}
                onChange={e => setForm({ ...form, first_name: e.target.value })}
                error={errors.first_name}
              />
              <Input
                label="Apellido *"
                value={form.last_name}
                onChange={e => setForm({ ...form, last_name: e.target.value })}
                error={errors.last_name}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Teléfono"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <Input
              label="Dirección"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />

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
        <Modal title="Eliminar Cliente" onClose={closeModal} width={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 14, color: '#374151' }}>
              ¿Eliminar a <strong>{selected?.first_name} {selected?.last_name}</strong>?
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