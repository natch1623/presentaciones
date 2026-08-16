/**
 * La cadena de bloques funcionales, dibujada como una órbita de seis
 * nodos por la que fluye la señal.
 *
 * Aparece completa en la diapositiva que presenta el modelo y luego se
 * repite en miniatura en cada bloque, con el nodo correspondiente
 * encendido: es el hilo que mantiene al participante ubicado dentro de
 * la cadena mientras se desmenuza etapa por etapa.
 */

export const ETAPAS = [
  { id: 'alim', t: 'Alimentación', s: 'red y batería → tensiones reguladas' },
  { id: 'sens', t: 'Sensor', s: 'variable fisiológica → señal eléctrica' },
  { id: 'acon', t: 'Acondicionamiento', s: 'amplifica, filtra y aísla' },
  { id: 'proc', t: 'Procesamiento', s: 'digitaliza y calcula' },
  { id: 'sali', t: 'Salida / display', s: 'presenta el resultado' },
  { id: 'ctrl', t: 'Control / actuadores', s: 'ejecuta la terapia' },
]

export default function CadenaFuncional({
  /** Índice de la etapa encendida. `-1` deja la cadena entera activa. */
  activo = -1,
  /** `mini` cabe en el pie de una diapositiva de contenido. */
  variant = 'full',
}: {
  activo?: number
  variant?: 'full' | 'mini'
}) {
  const mini = variant === 'mini'
  const W = 1180
  const H = mini ? 96 : 250
  const cy = mini ? 40 : 104
  const r = mini ? 16 : 34
  const paso = (W - 120) / (ETAPAS.length - 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }} aria-hidden={mini}>
      <defs>
        <linearGradient id={`cfFlow${variant}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8d82e8" />
          <stop offset="50%" stopColor="#72c7ff" />
          <stop offset="100%" stopColor="#bdf8ff" />
        </linearGradient>
        <filter id={`cfGlow${variant}`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation={mini ? 2.5 : 5} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* El flujo de la señal: una línea orbital, no una flecha */}
      <line
        x1={60}
        y1={cy}
        x2={60 + paso * (ETAPAS.length - 1)}
        y2={cy}
        stroke={`url(#cfFlow${variant})`}
        strokeWidth={mini ? 1 : 1.4}
        strokeOpacity="0.5"
      />

      {ETAPAS.map((e, i) => {
        const cx = 60 + paso * i
        const on = activo === -1 || activo === i
        const col = activo === i ? '#bdf8ff' : on ? '#72c7ff' : 'rgba(170,184,214,0.5)'
        return (
          <g
            key={e.id}
            style={
              mini
                ? undefined
                : {
                    animation: `constellationPop 0.7s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.11}s both`,
                    transformOrigin: `${cx}px ${cy}px`,
                  }
            }
          >
            {activo === i && (
              <circle cx={cx} cy={cy} r={r + (mini ? 7 : 14)} fill="rgba(189,248,255,0.07)" stroke="rgba(189,248,255,0.22)" strokeWidth="0.7" />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="rgba(8,13,36,0.88)"
              stroke={col}
              strokeOpacity={activo === i ? 0.95 : 0.5}
              strokeWidth={activo === i ? 1.5 : 1}
              filter={activo === i ? `url(#cfGlow${variant})` : undefined}
            />
            {/* Media luna dentro del nodo: la marca del dominio */}
            <path
              d={`M ${cx} ${cy - r * 0.44} A ${r * 0.44} ${r * 0.44} 0 1 0 ${cx} ${cy + r * 0.44} A ${r * 0.30} ${r * 0.44} 0 1 1 ${cx} ${cy - r * 0.44} Z`}
              fill={col}
              fillOpacity={activo === i ? 0.85 : 0.35}
            />

            <text
              x={cx}
              y={cy + r + (mini ? 15 : 30)}
              textAnchor="middle"
              fill={activo === i ? '#f5f7ff' : on ? '#aab8d6' : 'rgba(170,184,214,0.55)'}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: mini ? 10 : 14, fontWeight: activo === i ? 500 : 400 }}
            >
              {e.t}
            </text>
            {!mini && (
              <text
                x={cx}
                y={cy + r + 48}
                textAnchor="middle"
                fill="rgba(170,184,214,0.62)"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 10.5 }}
              >
                {e.s}
              </text>
            )}
          </g>
        )
      })}

      {/* Alarmas y seguridad: transversal a toda la cadena */}
      {!mini && (
        <>
          <path
            d={`M 60 ${cy - 74} L ${60 + paso * 5} ${cy - 74}`}
            stroke="rgba(255,143,168,0.30)"
            strokeWidth="1"
            strokeDasharray="4 7"
          />
          <text
            x={60 + (paso * 5) / 2}
            y={cy - 84}
            textAnchor="middle"
            fill="#ff8fa8"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, letterSpacing: '0.12em' }}
          >
            ALARMAS Y SEGURIDAD · transversal a toda la cadena
          </text>
        </>
      )}
    </svg>
  )
}
