const styles = {
  completada: { background: '#dcfce7', color: '#15803d' },
  anulada:    { background: '#fee2e2', color: '#dc2626' },
  pendiente:  { background: '#fef9c3', color: '#a16207' },
  default:    { background: '#f3f4f6', color: '#374151' },
}

export default function Badge({ status }) {
  const label = status?.toLowerCase() || 'default'
  const style = styles[label] || styles.default

  return (
    <span style={{
      ...style,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 2,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}