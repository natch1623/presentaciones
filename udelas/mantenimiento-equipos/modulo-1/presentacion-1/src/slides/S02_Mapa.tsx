import { SlideLayout, SlideTag, SlideTitle, Frost, Badge } from './SlideLayout'

/**
 * Mapa del módulo: los seis equipos y, para cada uno, la intervención
 * que define su mantenimiento. No es un índice decorativo — cada
 * tarjeta anticipa la tarea que el técnico va a practicar.
 */
export default function S02_Mapa() {
  const EQUIPOS = [
    {
      n: '01',
      nombre: 'Centrífuga',
      clave: 'Verificar rpm y tiempo',
      detalle: 'Tacómetro óptico, balanceo de carga, inspección de rotor y escobillas.',
      riesgo: 'Rotor',
      tone: 'frost' as const,
    },
    {
      n: '02',
      nombre: 'Microscopio',
      clave: 'Alinear e iluminar',
      detalle: 'Limpieza de óptica, colimación Köhler, ajuste de platina y condensador.',
      riesgo: 'Óptica',
      tone: 'frost' as const,
    },
    {
      n: '03',
      nombre: 'Cámara de flujo laminar',
      clave: 'Medir velocidad de aire',
      detalle: 'Anemómetro, integridad del filtro HEPA, prueba de humo, lámpara UV.',
      riesgo: 'HEPA',
      tone: 'rift' as const,
    },
    {
      n: '04',
      nombre: 'Esterilizador de vapor',
      clave: 'Validar el ciclo',
      detalle: 'Presión‑temperatura, empaques, válvula de seguridad, controles biológicos.',
      riesgo: 'Presión',
      tone: 'crimson' as const,
    },
    {
      n: '05',
      nombre: 'Lavador de ELISA',
      clave: 'Desobstruir y calibrar',
      detalle: 'Volumen dispensado, residual por pozo, purga de agujas y bomba.',
      riesgo: 'Obstrucción',
      tone: 'rift' as const,
    },
    {
      n: '06',
      nombre: 'Incubadora de CO₂',
      clave: 'Calibrar CO₂ y temperatura',
      detalle: 'Analizador Fyrite/IR, sensor TC vs IR, humedad, descontaminación.',
      riesgo: 'Contaminación',
      tone: 'mint' as const,
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>Mapa del módulo</SlideTag>
      <SlideTitle size="md">
        <span>Seis equipos, seis </span>
        <Frost><span>intervenciones que hay que saber hacer</span></Frost>
      </SlideTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 14,
          flex: 1,
          minHeight: 0,
        }}
      >
        {EQUIPOS.map((e, i) => (
          <div
            key={e.n}
            className="shard-card stagger-item"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `2px solid var(--${e.tone === 'crimson' ? 'crimson' : e.tone === 'mint' ? 'mint' : e.tone === 'rift' ? 'rift' : 'frost'})`,
              animationDelay: `${0.06 + i * 0.07}s`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <span
                className="font-rune"
                style={{
                  fontSize: 26,
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(143,220,255,0.55)',
                }}
              >
                {e.n}
              </span>
              <Badge tone={e.tone}>{e.riesgo}</Badge>
            </div>

            <div
              className="font-display"
              style={{ fontSize: 23, color: 'var(--ice)', lineHeight: 1.1, marginTop: 6 }}
            >
              <span>{e.nombre}</span>
            </div>

            <div
              className="font-mono"
              style={{
                fontSize: 9.5,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--frost)',
                marginTop: 6,
                marginBottom: 7,
              }}
            >
              <span>{e.clave}</span>
            </div>

            <p style={{ fontSize: 11.5, color: 'var(--ice-faint)', lineHeight: 1.5, margin: 0 }}>
              <span>{e.detalle}</span>
            </p>
          </div>
        ))}
      </div>

      <div
        className="stagger-item"
        style={{
          marginTop: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animationDelay: '0.6s',
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: 9.5, letterSpacing: '0.14em', color: 'var(--rift-soft)', textTransform: 'uppercase' }}
        >
          <span>Criterio del módulo</span>
        </span>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--edge-rift), transparent)' }} />
        <span style={{ fontSize: 11.5, color: 'var(--ice-dim)' }}>
          <span>
            Si no se puede medir, no se puede dar por bueno: cada rutina termina en un valor
            comparado contra una tolerancia.
          </span>
        </span>
      </div>
    </SlideLayout>
  )
}
