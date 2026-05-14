export default function StatCard({ title, value, sub, icon }) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#6b7280',
        }}>
          {title}
        </span>
        {icon && <span style={{ color: '#9ca3af', fontSize: 18 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: '#6b7280' }}>{sub}</div>
      )}
    </div>
  )
}