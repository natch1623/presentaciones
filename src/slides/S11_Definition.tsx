import { SlideLayout, SlideTitle, CyanAccent, Card, Divider } from './SlideLayout'

const terms = [
  { term: 'Sala de operaciones / quirófano', scope: 'El recinto donde se opera (zona blanca)' },
  { term: 'Unidad quirúrgica / bloque quirúrgico', scope: 'Conjunto funcional: quirófanos + preoperatorio + URPA + CEyE + vestidores + lavabos' },
  { term: 'Área quirúrgica', scope: 'Delimitación arquitectónica que incluye las tres zonas de restricción' },
  { term: 'Campo estéril', scope: 'Superficie delimitada por textiles estériles alrededor del sitio operatorio' },
]

export default function S11_Definition() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Definición y <CyanAccent>Terminología</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'space-between' }}>
      <Card accent="cyan" style={{ padding: '22px 26px' }}>
        <p className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', marginBottom: 12, letterSpacing: '0.1em' }}>
          DEFINICIÓN OPERATIVA
        </p>
        <p style={{ fontSize: 16, color: 'var(--white)', lineHeight: 1.85, margin: 0 }}>
          <strong style={{ color: 'var(--cyan-bright)' }}>Salón de operaciones (quirófano):</strong>{' '}
          ambiente hospitalario de{' '}
          <em>ubicación terminal en la circulación —sin tránsito de paso—</em>, totalmente equipado y de
          acceso restringido, con control activo de las condiciones de{' '}
          <strong>aire, temperatura, humedad, presión diferencial, iluminación, gases medicinales y
          energía eléctrica</strong>, destinado a la ejecución de procedimientos quirúrgicos bajo
          técnica aséptica y soporte anestésico monitorizado.
        </p>
      </Card>

      <div>
        <p style={{ fontSize: 13, color: 'var(--white-faint)', marginBottom: 12 }}>
          ⚠️ Términos que <strong style={{ color: '#fbbf24' }}>NO son sinónimos</strong>:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {terms.map((t, i) => (
            <div
              key={t.term}
              className="card-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 3fr',
                gap: 16,
                padding: '16px 20px',
                background: i === 0 ? 'rgba(0,212,255,0.06)' : 'rgba(10,26,74,0.4)',
                border: `1px solid ${i === 0 ? 'rgba(0,212,255,0.2)' : 'rgba(240,249,255,0.06)'}`,
                borderRadius: 9,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: i === 0 ? 'var(--cyan-bright)' : 'var(--white)',
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {t.term}
              </span>
              <span style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.5 }}>{t.scope}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(109,40,217,0.08)',
          border: '1px solid rgba(109,40,217,0.2)',
          borderRadius: 8,
        }}
      >
        <p style={{ fontSize: 13, color: '#a78bfa', margin: 0, lineHeight: 1.6 }}>
          🎙️ Error frecuente en informes técnicos: usar "quirófano" y "bloque quirúrgico" como intercambiables.
        </p>
      </div>
      </div>
    </SlideLayout>
  )
}
