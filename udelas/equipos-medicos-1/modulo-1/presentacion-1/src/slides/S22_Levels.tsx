import { At, Ghost, Halo, Title, Ac, Eyebrow, WD, dly } from './Stage'

/**
 * Los tres niveles de complejidad. La versión anterior era una
 * matriz de 3×7 con fondos alternos —la definición misma de
 * dashboard—, y encima obligaba a leer en zigzag. Aquí cada nivel
 * ocupa su propia escena, con su numeral romano al fondo, y la
 * comparación se hace pasando de una a la siguiente: los siete
 * rótulos caen siempre en el mismo sitio, así que lo que cambia
 * salta a la vista.
 */
const rows: { key: keyof Level; label: string }[] = [
  { key: 'location',   label: 'Ubicación' },
  { key: 'anesthesia', label: 'Anestesia' },
  { key: 'equipment',  label: 'Equipamiento' },
  { key: 'hvac',       label: 'HVAC' },
  { key: 'procedures', label: 'Procedimientos' },
  { key: 'support',    label: 'Soporte' },
  { key: 'biomed',     label: 'Rol Biomédico' },
]

export interface Level {
  level: string
  sub: string
  color: string
  numeral: string
  location: string
  anesthesia: string
  equipment: string
  hvac: string
  procedures: string
  support: string
  biomed: string
}

export function LevelScene({ l: lv, first }: { l: Level; first?: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text={lv.numeral} side="right" size={520} top={150} opacity={0.035} color={lv.color} />
      <Halo x={1190} y={430} size={880} color={`${lv.color}22`} />
      <Halo x={140} y={180} size={600} color="rgba(37,99,235,0.16)" />

      {first ? (
        <At l={96} t={72} w={900} anim="none">
          <Title size={44} d={0}>
            Niveles de <Ac>complejidad</Ac> del salón de operaciones
          </Title>
        </At>
      ) : (
        <At l={100} t={84} anim="none">
          <Eyebrow d={0} color={lv.color}>Niveles de complejidad · continuación</Eyebrow>
        </At>
      )}

      <At l={100} t={first ? 148 : 122} d={1} anim="drift">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <span
            className="font-mono"
            style={{ fontSize: 34, color: lv.color, letterSpacing: '0.2em', fontWeight: 700, textShadow: `0 0 34px ${lv.color}66` }}
          >
            {lv.level}
          </span>
          <span style={{ fontSize: 19, color: 'rgba(240,249,255,0.45)', fontWeight: 300 }}>{lv.sub}</span>
        </div>
      </At>

      <At l={-70} t={first ? 210 : 184} w={700} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${lv.color})`, boxShadow: `0 0 16px ${lv.color}66`, ...dly(2) }}
        />
      </At>

      {rows.map((r, i) => {
        const last = i === rows.length - 1
        return (
          <At key={r.key} l={100} t={(first ? 246 : 222) + i * 74} w={1240} d={2 + i} anim="drift">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
              <span
                className="font-mono"
                style={{
                  width: 158, textAlign: 'right', flexShrink: 0, fontSize: 10.5,
                  color: last ? lv.color : 'rgba(56,189,248,0.7)',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                }}
              >
                {r.label}
              </span>
              <p
                style={{
                  flex: 1, margin: 0, lineHeight: 1.5,
                  fontSize: last ? 18 : 17,
                  color: last ? lv.color : WD,
                  fontWeight: last ? 500 : 300,
                  maxWidth: 1020,
                }}
              >
                {lv[r.key]}
              </p>
            </div>
            <div
              className="span-x"
              style={{
                width: 1200, height: 1, marginTop: 14,
                background: last
                  ? `linear-gradient(90deg, ${lv.color}66, transparent)`
                  : 'linear-gradient(90deg, rgba(240,249,255,0.07), transparent)',
                ...dly(3 + i),
              }}
            />
          </At>
        )
      })}

      {/* La escala de complejidad, marcada en el margen inferior */}
      <At l={100} b={68} d={10} z={3}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['I', 'II', 'III'].map((n, i) => {
            const on = lv.numeral.length > i
            return (
              <span
                key={n}
                className="font-mono"
                style={{
                  fontSize: 10, letterSpacing: '0.2em',
                  color: on ? lv.color : 'rgba(240,249,255,0.14)',
                  textShadow: on ? `0 0 10px ${lv.color}66` : 'none',
                }}
              >
                {n}
              </span>
            )
          })}
        </div>
      </At>
    </div>
  )
}
