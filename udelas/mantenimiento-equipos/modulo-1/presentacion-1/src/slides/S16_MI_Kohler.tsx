import { SlideLayout, SlideTag, SlideTitle, Frost, Step, Figure, Callout, Panel } from './SlideLayout'

/**
 * Alineación de Köhler. Es el procedimiento que más veces va a ejecutar
 * el técnico y el que más rápido devuelve un microscopio «malo» al
 * servicio, así que se lleva una diapositiva entera con su secuencia
 * y su evidencia visual.
 */
export default function S16_MI_Kohler() {
  return (
    <SlideLayout>
      <SlideTag>02 · Microscopio — procedimiento clave</SlideTag>
      <SlideTitle size="md">
        <span>Alineación de Köhler: </span>
        <Frost><span>iluminación pareja en siete movimientos</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1, minHeight: 0 }}>
        {/* ── Secuencia ── */}
        <Panel label="Secuencia · objetivo 10× de referencia" tone="frost" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <Step n="1" title="Enfocar la muestra">
              Con el 10× y el condensador en su posición aproximada de trabajo.
            </Step>
            <Step n="2" title="Cerrar el diafragma de campo">
              Casi por completo: debe aparecer un polígono luminoso pequeño dentro del campo.
            </Step>
            <Step n="3" title="Enfocar el polígono">
              Subir o bajar el condensador hasta que el borde del polígono se vea recortado y nítido.
            </Step>
            <Step n="4" title="Centrarlo">
              Con los dos tornillos del condensador, llevar el polígono al centro exacto del campo.
            </Step>
            <Step n="5" title="Abrir hasta el borde">
              Abrir el diafragma de campo justo hasta que su borde salga del campo visual, ni más.
            </Step>
            <Step n="6" title="Ajustar la apertura" tone="amber">
              Retirar un ocular y cerrar el diafragma de apertura hasta ocupar 70–80 % del círculo
              luminoso del objetivo.
            </Step>
            <Step n="7" title="Repetir al cambiar de aumento" tone="mint">
              Cada objetivo tiene su apertura: la alineación se retoca al pasar de 10× a 40× o 100×.
            </Step>
          </div>
        </Panel>

        {/* ── Evidencia visual ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure tone="frost" caption="Lo que se ve por el ocular en los pasos 2, 4 y 5.">
            <SecuenciaKohler />
          </Figure>

          <Callout kind="mint" title="Cómo saber que quedó bien">
            El fondo se ve parejo de borde a borde, sin zona más brillante en el centro ni sombra en
            una esquina, y el contraste sube sin que la imagen pierda detalle.
          </Callout>

          <Callout kind="amber" title="El síntoma que delata la falta de Köhler">
            Un campo con un lado oscuro o una imagen que «mejora» al mover la muestra de sitio: el
            condensador está descentrado, no hay problema en el objetivo.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}

/* ── Tres campos visuales: cerrado y descentrado → centrado → abierto ── */
function SecuenciaKohler() {
  const ICE = '#eaf6ff'
  const FROST = '#8fdcff'
  const AMBER = '#ffb44d'

  /** Polígono luminoso del diafragma de campo, con r y desplazamiento. */
  const Poly = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
    const pts = Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 - Math.PI / 2
      return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`
    }).join(' ')
    return <polygon points={pts} fill={AMBER} fillOpacity="0.30" stroke={AMBER} strokeWidth="1.4" />
  }

  const Campo = ({
    x,
    label,
    cx,
    r,
  }: {
    x: number
    label: string
    cx: number
    r: number
  }) => (
    <g>
      <circle cx={x} cy={92} r="58" fill="#04050e" stroke={ICE} strokeOpacity="0.35" strokeWidth="1.3" />
      <clipPath id={`clip${x}`}>
        <circle cx={x} cy={92} r="58" />
      </clipPath>
      <g clipPath={`url(#clip${x})`}>
        <Poly cx={x + cx} cy={92} r={r} />
      </g>
      <text
        x={x}
        y={172}
        textAnchor="middle"
        fill={FROST}
        fontSize="10"
        fontFamily="JetBrains Mono, monospace"
      >
        {label}
      </text>
    </g>
  )

  return (
    <svg viewBox="0 0 420 190" style={{ width: '100%', height: '100%' }}>
      <Campo x={68} label="paso 2" cx={-16} r={26} />
      <Campo x={210} label="paso 4" cx={0} r={26} />
      <Campo x={352} label="paso 5" cx={0} r={60} />

      {/* flechas entre campos */}
      <path d="M 134,92 L 150,92 M 145,88 L 151,92 L 145,96" stroke={FROST} strokeWidth="1.1" fill="none" />
      <path d="M 276,92 L 292,92 M 287,88 L 293,92 L 287,96" stroke={FROST} strokeWidth="1.1" fill="none" />
    </svg>
  )
}
