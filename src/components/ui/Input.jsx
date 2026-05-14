export default function Input({
  label,
  error,
  type = 'text',
  fullWidth = true,
  ...props
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#6b7280',
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
          borderRadius: 4,
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.15s',
          background: '#fff',
        }}
        onFocus={e => e.target.style.borderColor = '#111'}
        onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb'}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>
      )}
    </div>
  )
}