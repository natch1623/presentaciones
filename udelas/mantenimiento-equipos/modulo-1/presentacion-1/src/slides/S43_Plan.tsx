import { SlideLayout, SlideTag, SlideTitle, Frost, Callout, TONE, type Tone } from './SlideLayout'

/**
 * El programa anual de los seis equipos en una sola vista. Es la
 * diapositiva que el técnico va a fotografiar: de acá sale el
 * calendario de mantenimiento del laboratorio.
 */
export default function S43_Plan() {
  const COLUMNAS: { k: string; tone: Tone }[] = [
    { k: 'Diario / cada uso', tone: 'frost' },
    { k: 'Semanal', tone: 'frost' },
    { k: 'Mensual', tone: 'rift' },
    { k: 'Trimestral', tone: 'rift' },
    { k: 'Semestral', tone: 'amber' },
    { k: 'Anual', tone: 'crimson' },
  ]

  const FILAS: { eq: string; celdas: string[] }[] = [
    {
      eq: 'Centrífuga',
      celdas: [
        'Cámara, derrames y enclavamiento',
        'Tubos, copas y adaptadores',
        'Rosca, asiento y nivelación',
        '—',
        'rpm, tiempo, escobillas',
        'Seguridad eléctrica',
      ],
    },
    {
      eq: 'Microscopio',
      celdas: [
        'Retiro del aceite de inmersión',
        'Oculares, objetivos y platina',
        'Condensador y diafragmas',
        'Köhler y ajuste del coaxial',
        'Lámpara y contactos',
        'Seguridad eléctrica',
      ],
    },
    {
      eq: 'Flujo laminar',
      celdas: [
        'Superficie y rejillas libres',
        'Limpieza de la lámpara UV',
        'Prefiltro y presión diferencial',
        '—',
        'Velocidad, humo e intensidad UV',
        'Integridad HEPA y certificación',
      ],
    },
    {
      eq: 'Esterilizador',
      celdas: [
        'Agua, empaque, drenaje, Bowie‑Dick',
        'Cámara e indicador biológico',
        'Válvula de alivio y trampa',
        '—',
        'Manómetro, sensor y fuga de vacío',
        'Resistencias y aislamiento',
      ],
    },
    {
      eq: 'Lavador de ELISA',
      celdas: [
        'Purga, frasco y agujas',
        'Ciclo de descontaminación',
        'Tubería y gravimetría',
        '—',
        'Alineación y bomba',
        'Seguridad eléctrica',
      ],
    },
    {
      eq: 'Incubadora de CO₂',
      celdas: [
        'Lecturas y nivel de agua',
        'Cambio de agua de la bandeja',
        'Superficies y empaque',
        'Verificación de CO₂ y temperatura',
        'Filtros y descontaminación',
        'Alarmas y seguridad eléctrica',
      ],
    },
  ]

  const grid = '128px repeat(6, 1fr)'

  return (
    <SlideLayout>
      <SlideTag tone="rift">Cierre · programa</SlideTag>
      <SlideTitle size="md">
        <span>El año completo </span>
        <Frost><span>de los seis equipos, en una vista</span></Frost>
      </SlideTitle>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Encabezado */}
        <div
          className="font-mono"
          style={{
            display: 'grid',
            gridTemplateColumns: grid,
            gap: 6,
            fontSize: 9,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          <span />
          {COLUMNAS.map(c => (
            <span
              key={c.k}
              style={{
                color: TONE[c.tone].fg,
                padding: '6px 9px',
                background: TONE[c.tone].bg,
                borderBottom: `2px solid ${TONE[c.tone].fg}`,
                textAlign: 'center',
              }}
            >
              {c.k}
            </span>
          ))}
        </div>

        {/* Filas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
          {FILAS.map((f, ri) => (
            <div
              key={f.eq}
              className="stagger-item"
              style={{
                display: 'grid',
                gridTemplateColumns: grid,
                gap: 6,
                alignItems: 'stretch',
                animationDelay: `${0.08 + ri * 0.07}s`,
              }}
            >
              <div
                className="font-display"
                style={{
                  fontSize: 16,
                  color: 'var(--ice)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 10,
                  borderLeft: '2px solid var(--frost)',
                  lineHeight: 1.15,
                }}
              >
                <span>{f.eq}</span>
              </div>

              {f.celdas.map((c, ci) => {
                const vacia = c === '—'
                const tone = COLUMNAS[ci].tone
                return (
                  <div
                    key={ci}
                    style={{
                      fontSize: 10,
                      lineHeight: 1.35,
                      color: vacia ? 'var(--ice-faint)' : 'var(--ice-dim)',
                      padding: '8px 9px',
                      background: vacia ? 'rgba(234,246,255,0.012)' : TONE[tone].bg,
                      borderTop: `1px solid ${vacia ? 'rgba(234,246,255,0.05)' : TONE[tone].edge}`,
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                      justifyContent: 'center',
                      clipPath:
                        'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    }}
                  >
                    <span>{c}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <Callout kind="rift" title="Cómo se convierte en calendario">
          Se reparte por semanas del año, no por meses: la carga anual completa concentrada en
          diciembre no se ejecuta nunca. Cada tarea semestral y anual entra con fecha fija y con el
          instrumento reservado.
        </Callout>
      </div>
    </SlideLayout>
  )
}
