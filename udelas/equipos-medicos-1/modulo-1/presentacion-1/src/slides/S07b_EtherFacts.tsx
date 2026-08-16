import { At, Ghost, Halo, Eyebrow, CY, CYM, GO, WH, WD, WF, dly } from './Stage'

const facts = [
  { label: 'Paciente', value: 'Gilbert Abbott', sub: 'Exéresis de tumor vascular en el cuello' },
  { label: 'Cirujano', value: 'John Collins Warren', sub: '' },
  { label: 'Anestesista', value: 'William T.G. Morton', sub: 'Odontólogo — inventor del inhalador' },
  {
    label: 'Dispositivo',
    value: 'Inhalador de vidrio con éter sulfúrico y válvula unidireccional',
    sub: 'El primer "equipo de anestesia" de la historia',
  },
]

/**
 * La ficha del caso, sin ficha. Cada rótulo cuelga en el margen y
 * el dato corre libre a su derecha; la última entrada —el
 * dispositivo— es la que interesa a esta carrera, y por eso es la
 * que crece.
 */
export default function S07b_EtherFacts() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="01" side="right" size={420} top={340} opacity={0.028} font="mono" />
      <Halo x={1260} y={480} size={780} color="rgba(245,158,11,0.14)" />
      <Halo x={160} y={160} size={620} color="rgba(0,212,255,0.15)" />

      <At l={100} t={92} anim="none">
        <Eyebrow d={0}>El primer equipo de anestesia de la historia</Eyebrow>
      </At>

      {facts.map((f, i) => {
        const big = i === 3
        return (
          <At key={f.label} l={100 + i * 22} t={158 + i * 112} w={1180} d={1 + i} anim="drift">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
              <span
                className="font-mono"
                style={{
                  width: 132, textAlign: 'right', flexShrink: 0, fontSize: 10.5,
                  color: big ? CY : CYM, letterSpacing: '0.2em', textTransform: 'uppercase',
                }}
              >
                {f.label}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: big ? 27 : 24, color: big ? CY : WH, lineHeight: 1.35,
                    margin: 0, fontWeight: big ? 500 : 400,
                    textShadow: big ? `0 0 38px ${CY}44` : 'none',
                  }}
                >
                  {f.value}
                </p>
                {f.sub && (
                  <p style={{ fontSize: 14, color: WF, margin: '8px 0 0', lineHeight: 1.5 }}>{f.sub}</p>
                )}
              </div>
            </div>
          </At>
        )
      })}

      <At l={-40} t={636} w={620} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${GO})`, boxShadow: `0 0 14px ${GO}55`, ...dly(6) }}
        />
      </At>

      <At l={100} t={668} w={1190} d={7}>
        <p className="font-mono" style={{ fontSize: 10.5, color: GO, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px' }}>
          Para ingeniería biomédica
        </p>
        <p style={{ fontSize: 17, color: WD, lineHeight: 1.65, margin: 0, fontWeight: 300 }}>
          El inhalador de Morton ya contenía los tres elementos de una máquina de anestesia moderna:
          (1) reservorio del agente, (2) mecanismo de vaporización, y (3) sistema de conducción unidireccional.
        </p>
      </At>
    </div>
  )
}
