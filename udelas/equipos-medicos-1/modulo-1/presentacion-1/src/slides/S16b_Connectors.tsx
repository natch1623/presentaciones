import { SlideLayout, SlideTitle, CyanAccent, Badge } from './SlideLayout'
import dissOutlet from '../assets/connectors/diss-outlet.png'
import dissConnector from '../assets/connectors/diss-connector.png'
import chemetronMale from '../assets/connectors/chemetron-male.png'
import chemetronFemale from '../assets/connectors/chemetron-female.png'
import ohmedaMale from '../assets/connectors/ohmeda-diamond-male.png'
import ohmedaFemale from '../assets/connectors/ohmeda-diamond-female.png'

const systems = [
  {
    name: 'DISS',
    full: 'Diameter Index Safety System',
    type: 'Roscado',
    color: '#00d4ff',
    images: [
      { src: dissOutlet, alt: 'Toma de pared DISS de oxígeno' },
      { src: dissConnector, alt: 'Conector roscado DISS' },
    ],
    desc: 'Cada gas tiene un diámetro y paso de rosca distintos e incompatibles entre sí. Se usa en tomas de techo/columna, mangueras de alta presión y equipos portátiles.',
    use: 'Columnas, brazos pendulares, mangueras a equipos',
  },
  {
    name: 'Chemetron',
    full: 'Acople rápido tipo Chemetron',
    type: 'Quick-connect',
    color: '#a78bfa',
    images: [
      { src: chemetronMale, alt: 'Acople macho Chemetron' },
      { src: chemetronFemale, alt: 'Acople hembra Chemetron' },
    ],
    desc: 'Conexión de empuje (push-to-connect) sin rosca; cada gas tiene una geometría de pines y cuerpo única. Muy común en tomas de pared en EE. UU. y hospitales con equipos de ese mercado.',
    use: 'Tomas de pared, cabeceras de cama, brazos de techo',
  },
  {
    name: 'Ohmeda / Diamond',
    full: 'Acople rápido tipo Ohmeda (Diamond)',
    type: 'Quick-connect',
    color: '#fbbf24',
    images: [
      { src: ohmedaMale, alt: 'Acople macho Ohmeda Diamond' },
      { src: ohmedaFemale, alt: 'Acople hembra Ohmeda Diamond' },
    ],
    desc: 'Mismo principio de empuje que Chemetron, pero con indexado y forma propios: NO son intercambiables entre sí aunque sea el mismo gas. Igual de común en el mercado estadounidense.',
    use: 'Tomas de pared, cabeceras de cama, brazos de techo',
  },
]

export default function S16b_Connectors() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Conectores de gases: <CyanAccent>tres sistemas, cero intercambio</CyanAccent>
      </SlideTitle>
      <p style={{ fontSize: 13, color: 'var(--white-faint)', margin: '-14px 0 18px', lineHeight: 1.6 }}>
        La seguridad no depende del color de la etiqueta, sino de que el acople sea{' '}
        <strong style={{ color: 'var(--cyan-mid)' }}>físicamente imposible de conectar al gas equivocado</strong>.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1, minHeight: 0 }}>
        {systems.map((s, i) => (
          <div
            key={s.name}
            className="card-hover"
            style={{
              display: 'flex', flexDirection: 'column', gap: 12,
              background: 'linear-gradient(135deg, rgba(10,26,74,0.8) 0%, rgba(6,15,46,0.95) 100%)',
              border: `1px solid ${s.color}30`,
              borderTop: `2px solid ${s.color}`,
              borderRadius: 12,
              padding: '18px 18px',
              position: 'relative', overflow: 'hidden',
              animation: `fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.12}s both`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 30px ${s.color}08`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <p className="font-display" style={{ fontSize: 19, color: s.color, margin: 0, textShadow: `0 0 16px ${s.color}50` }}>
                  {s.name}
                </p>
                <p className="font-mono" style={{ fontSize: 9, color: 'var(--white-faint)', margin: '2px 0 0' }}>
                  {s.full}
                </p>
              </div>
              <Badge variant={i === 0 ? 'cyan' : i === 1 ? 'violet' : 'gold'}>{s.type}</Badge>
            </div>

            {/* Image pair */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {s.images.map((img) => (
                <div
                  key={img.alt}
                  style={{
                    background: 'rgba(240,249,255,0.04)',
                    border: `1px solid ${s.color}20`,
                    borderRadius: 8,
                    padding: 6,
                    aspectRatio: '1 / 1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 0 8px ${s.color}30)` }}
                  />
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: 'var(--white-dim)', margin: 0, lineHeight: 1.55, flex: 1 }}>
              {s.desc}
            </p>

            <div style={{ height: 1, background: `linear-gradient(90deg, ${s.color}35, transparent)` }} />

            <p className="font-mono" style={{ fontSize: 9.5, color: s.color, margin: 0, letterSpacing: '0.04em' }}>
              {s.use.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: '14px 18px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderLeft: '3px solid #ef4444',
          borderRadius: 10,
        }}
      >
        <p style={{ fontSize: 13, color: '#fca5a5', margin: 0, lineHeight: 1.6 }}>
          🔧 <strong>Rol del ingeniero biomédico:</strong>{' '}
          <span style={{ color: 'var(--white-dim)' }}>
            Al especificar, instalar o dar mantenimiento a tomas de gases, verificar siempre que el sistema de acople (DISS, Chemetron u Ohmeda/Diamond) sea consistente en toda la instalación — mezclar sistemas obliga a usar adaptadores, y cada adaptador es un punto adicional de falla.
          </span>
        </p>
      </div>
    </SlideLayout>
  )
}
