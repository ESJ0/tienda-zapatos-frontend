import { useState, useCallback } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

const EMPTY = { first_name: '', last_name: '', email: '', role: 'vendedor' }
const ROLES  = ['vendedor', 'supervisor', 'administrador']

export default function Employees() {
  const { isAdmin }                           = useAuth()
  const { data: employees, loading, refetch } = useFetch('/employees')

  const [modal,    setModal]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [form,     setForm]     = useState(EMPTY)
  const [errors,   setErrors]   = useState({})
  const [saving,   setSaving]   = useState(false)
  const [apiErr,   setApiErr]   = useState('')

  const openCreate = useCallback(() => {
    setForm(EMPTY); setErrors({}); setApiErr(''); setModal('create')
  }, [])

  const openEdit = useCallback((e) => {
    setSelected(e)
    setForm({
      first_name: e.first_name || '',
      last_name:  e.last_name  || '',
      email:      e.email      || '',
      role:       e.role       || 'vendedor',
    })
    setErrors({}); setApiErr(''); setModal('edit')
  }, [])

  const openDelete = useCallback((e) => {
    setSelected(e); setModal('delete')
  }, [])

  const closeModal = useCallback(() => {
    setModal(null); setSelected(null)
  }, [])

  const validate = () => {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'El nombre es requerido'
    if (!form.last_name.trim())  errs.last_name  = 'El apellido es requerido'
    if (!form.email.trim())      errs.email      = 'El email es requerido'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true); setApiErr('')
    try {
      if (modal === 'create') {
        await api.post('/employees', form)
      } else {
        await api.put(`/employees/${selected.id}`, form)
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
      await api.delete(`/employees/${selected.id}`)
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
    {
      key: 'role', label: 'Rol',
      render: val => (
        <span style={{
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '2px 8px', borderRadius: 2,
          background: val === 'administrador' ? '#111' : '#f3f4f6',
          color:      val === 'administrador' ? '#fff' : '#374151',
        }}>
          {val}
        </span>
      ),
    },
    { key: 'hire_date', label: 'Fecha ingreso' },
    {
      key: 'actions', label: 'Acciones',
      render: (_, row) => isAdmin ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>Editar</Button>
          <Button size="sm" variant="danger"  onClick={() => openDelete(row)}>Borrar</Button>
        </div>
      ) : (
        <span style={{ fontSize: 11, color: '#9ca3af' }}>Sin permisos</span>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>EMPLEADOS</h1>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {employees?.length ?? 0} empleados registrados
            {!isAdmin && (
              <span style={{
                marginLeft: 12, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#f59e0b',
              }}>
                · Solo lectura
              </span>
            )}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>+ Nuevo empleado</Button>
        )}
      </div>

      {/* Aviso si no es admin */}
      {!isAdmin && (
        <div style={{
          padding: '12px 16px',
          background: '#fefce8', border: '1px solid #fde68a',
          borderRadius: 4, fontSize: 13, color: '#92400e',
        }}>
          Solo los administradores pueden crear, editar o eliminar empleados.
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <p style={{ color: '#9ca3af', padding: 40, textAlign: 'center' }}>Cargando...</p>
      ) : (
        <div style={{ border: '1px solid #e5e7eb' }}>
          <Table columns={columns} data={employees} emptyMessage="No hay empleados" />
        </div>
      )}

      {/* Modal crear / editar — solo admin */}
      {isAdmin && (modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'Nuevo Empleado' : 'Editar Empleado'}
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
            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />

            {/* Rol */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280',
              }}>
                Rol
              </label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                style={{
                  padding: '10px 12px', border: '1px solid #e5e7eb',
                  borderRadius: 4, fontSize: 14, background: '#fff',
                }}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
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

      {/* Modal eliminar — solo admin */}
      {isAdmin && modal === 'delete' && (
        <Modal title="Eliminar Empleado" onClose={closeModal} width={420}>
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