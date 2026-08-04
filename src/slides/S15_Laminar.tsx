import { SlideLayout, SlideTag, SlideTitle, CyanAccent, Card } from './SlideLayout'

export default function S15_Laminar() {
  return (
    <SlideLayout>
      <SlideTag>Pensamiento crítico</SlideTag>
      <SlideTitle size="md">
        Mito vs. Evidencia: el <CyanAccent>flujo laminar</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card accent="cyan">
            <p className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', marginBottom: 8, letterSpacing: '0.1em' }}>
              EL PARADIGMA CLÁSICO — CHARNLEY, 1960s
            </p>
            <p style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.7, margin: 0 }}>
              El flujo laminar/unidireccional reduce las partículas portadoras de microorganismos sobre el campo quirúrgico → debería reducir las infecciones del sitio quirúrgico (ISQ).
            </p>
          </Card>

          <Card accent="violet">
            <p className="font-mono" style={{ fontSize: 10, color: '#a78bfa', marginBottom: 8, letterSpacing: '0.1em' }}>
              EL GIRO — OMS, 2016–2018
            </p>
            <p style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: '#c4b5fd' }}>Recomendación condicional contraria:</strong> los sistemas de ventilación de flujo laminar{' '}
              <strong style={{ color: '#f87171' }}>no deberían usarse</strong> para reducir el riesgo de ISQ en artroplastia total. Datos del registro neozelandés sugieren que podrían{' '}
              <em>incrementar</em> las tasas de infección.
            </p>
          </Card>

          <Card accent="none">
            <p className="font-mono" style={{ fontSize: 10, color: 'var(--white-faint)', marginBottom: 8, letterSpacing: '0.1em' }}>
              LA CONTROVERSIA CONTINÚA
            </p>
            <p style={{ fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.7, margin: 0 }}>
              Grupos europeos argumentaron que los datos de registros subestimaban la incidencia de ISQ hasta en un 40%, y varios servicios continuaron utilizando flujo laminar.
            </p>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          {/* Key lesson */}
          <div
            style={{
              padding: '28px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(10,26,74,0.9))',
              border: '1px solid rgba(245,158,11,0.3)',
              borderLeft: '4px solid #f59e0b',
              borderRadius: 12,
            }}
          >
            <p
              className="font-display"
              style={{ fontSize: 22, color: '#fbbf24', margin: '0 0 12px', lineHeight: 1.3 }}
            >
              Lección para el ingeniero biomédico
            </p>
            <p style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.75, margin: 0 }}>
              Un sistema puede cumplir perfectamente su especificación técnica{' '}
              <span style={{ color: 'var(--white-faint)' }}>(reducir UFC/m³)</span> sin producir el beneficio clínico esperado.
            </p>
            <div
              style={{
                marginTop: 16,
                padding: '12px 16px',
                background: 'rgba(245,158,11,0.08)',
                borderRadius: 8,
              }}
            >
              <p style={{ fontSize: 13, color: '#fbbf24', margin: 0, fontWeight: 600 }}>
                La validación técnica y la validación clínica no son lo mismo.
              </p>
            </div>
          </div>

          {/* Discussion prompt */}
          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(109,40,217,0.08)',
              border: '1px solid rgba(109,40,217,0.25)',
              borderRadius: 10,
            }}
          >
            <p style={{ fontSize: 13, color: '#a78bfa', margin: 0, lineHeight: 1.6 }}>
              🎙️ <strong>Debate:</strong> ¿Ustedes recomendarían comprar flujo laminar para un quirófano nuevo en Panamá? Justifiquen.
            </p>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
