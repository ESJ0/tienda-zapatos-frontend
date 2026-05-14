import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e5e7eb',
      marginTop: 'auto',
      background: '#fff',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '48px 24px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 40,
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>ESJ0</div>
          <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.7 }}>
            Tienda de zapatos premium.<br />Calidad y estilo en cada paso.
          </p>
        </div>

        {/* Shop */}
        <div>
          <FooterHeading>Tienda</FooterHeading>
          <FooterLinks links={[
            { to: '/', label: 'Catálogo' },
            { to: '/?category=Deportivo', label: 'Deportivo' },
            { to: '/?category=Formal', label: 'Formal' },
            { to: '/?category=Bota', label: 'Botas' },
          ]} />
        </div>

        {/* Help */}
        <div>
          <FooterHeading>Ayuda</FooterHeading>
          <FooterLinks links={[
            { to: '/', label: 'Envíos' },
            { to: '/', label: 'Devoluciones' },
            { to: '/', label: 'Tallas' },
            { to: '/', label: 'Contacto' },
          ]} />
        </div>

        {/* Legal */}
        <div>
          <FooterHeading>Legal</FooterHeading>
          <FooterLinks links={[
            { to: '/', label: 'Privacidad' },
            { to: '/', label: 'Términos' },
          ]} />
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #e5e7eb',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: 11, color: '#9ca3af',
        letterSpacing: '0.05em',
      }}>
        © {new Date().getFullYear()} ESJ0 FOOTWEAR. ALL RIGHTS RESERVED.
      </div>
    </footer>
  )
}

function FooterHeading({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.15em', textTransform: 'uppercase',
      marginBottom: 16, color: '#111',
    }}>
      {children}
    </div>
  )
}

function FooterLinks({ links }) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {links.map(l => (
        <li key={l.label}>
          <Link
            to={l.to}
            style={{
              fontSize: 12, color: '#6b7280',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = '#111'}
            onMouseLeave={e => e.target.style.color = '#6b7280'}
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}