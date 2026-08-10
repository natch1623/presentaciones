import { SlideLayout, SlideTitle, CyanAccent, Card, Badge } from './SlideLayout'

const rows = [
  { period: 'Antigüedad', method: 'Opio, mandrágora, cannabis, alcohol, compresión nerviosa, hipotermia', limit: 'Dosis incontrolable, efecto impredecible', key: false },
  { period: 'S. XVI–XVII', method: '"Esponja soporífera", alcohol destilado, láudano', limit: 'Sin control de profundidad; riesgo de muerte', key: false },
  { period: '1772–1800', method: 'Joseph Priestley aísla N₂O; Humphry Davy describe efecto analgésico (1800)', limit: 'No se aplicó a cirugía por décadas', key: false },
  { period: '1842', method: 'Crawford Long usa éter en Georgia (no lo publica hasta 1849)', limit: 'Sin difusión → sin impacto', key: false },
  { period: '1844', method: 'Horace Wells demuestra N₂O públicamente… y fracasa', limit: 'Dosificación insuficiente', key: false },
  { period: '16 oct 1846', method: 'W.T.G. Morton administra éter con inhalador de vidrio — MGH Boston', limit: '✅ Éxito público y reproducible', key: true },
  { period: '1847', method: 'James Young Simpson introduce el cloroformo en obstetricia', limit: 'Hepatotoxicidad y arritmias (abandonado en s. XX)', key: false },
]

export default function S06_Pain() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Del opio al <CyanAccent>éter</CyanAccent>: evolución analgésica
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '130px 1fr 1fr',
            gap: 12,
            padding: '8px 16px',
          }}
        >
          {['Periodo', 'Método', 'Limitación / Resultado'].map((h) => (
            <span key={h} className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', letterSpacing: '0.1em' }}>
              {h.toUpperCase()}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          {rows.map((row) => (
            <Card
              key={row.period}
              accent={row.key ? 'cyan' : 'none'}
              style={{
                display: 'grid',
                gridTemplateColumns: '130px 1fr 1fr',
                gap: 12,
                padding: '14px 18px',
                background: row.key
                  ? 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(10,26,74,0.8) 100%)'
                  : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {row.key ? (
                  <Badge variant="cyan">{row.period}</Badge>
                ) : (
                  <span className="font-mono" style={{ fontSize: 11, color: 'var(--white-faint)' }}>
                    {row.period}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13.5, color: row.key ? 'var(--white)' : 'var(--white-dim)', margin: 0, lineHeight: 1.55 }}>
                {row.method}
              </p>
              <p
                style={{
                  fontSize: 13.5,
                  color: row.key ? 'var(--cyan-bright)' : 'var(--white-faint)',
                  margin: 0,
                  lineHeight: 1.55,
                  fontWeight: row.key ? 600 : 400,
                }}
              >
                {row.limit}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: '14px 18px',
          background: 'rgba(109,40,217,0.08)',
          border: '1px solid rgba(109,40,217,0.25)',
          borderRadius: 8,
        }}
      >
        <p style={{ fontSize: 13, color: '#a78bfa', margin: 0, lineHeight: 1.6 }}>
          💡 <strong>Nota:</strong> Morton no fue el primero, fue el primero en documentarlo públicamente y hacerlo <em>reproducible</em>. Ese es el criterio que define un hito tecnológico.
        </p>
      </div>
    </SlideLayout>
  )
}
