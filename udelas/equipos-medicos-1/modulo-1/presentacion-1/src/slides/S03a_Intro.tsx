import { At, Ghost, Halo, Icon, Title, Ac, CY, VI, GO, WD, WF, dly } from './Stage'
import iconBiologico from '../assets/icons/s03-01-biologico.png'
import iconSoporteVital from '../assets/icons/s03-02-soporte-vital.png'
import iconDensidadTec from '../assets/icons/s03-03-densidad-tec.png'

/**
 * Los tres controles que definen el quirófano. No son tres
 * tarjetas: es una cascada que desciende de izquierda a derecha,
 * cada escalón más abajo que el anterior y con su propia masa de
 * luz detrás, unidos por una diagonal que pasa por los tres.
 */
const pillars = [
  {
    icon: iconBiologico,
    label: 'Control Biológico',
    desc: 'Barrera anatómica abierta; aire, superficies y personal son vectores potenciales de infección.',
    color: CY,
    glow: 'rgba(0,212,255,0.2)',
    l: 96, t: 268,
    facts: [
      { stat: '3', label: 'zonas de restricción (negra / gris / blanca)' },
      { stat: 'HEPA', label: 'filtración y presión diferencial positiva' },
    ],
  },
  {
    icon: iconSoporteVital,
    label: 'Soporte Vital Activo',
    desc: 'Paciente bajo anestesia; funciones respiratoria y hemodinámica sostenidas artificialmente por equipos.',
    color: VI,
    glow: 'rgba(167,139,250,0.18)',
    l: 556, t: 350,
    facts: [
      { stat: '100%', label: 'dependencia de ventilación mecánica' },
      { stat: '1:1', label: 'monitorización continua por paciente' },
    ],
  },
  {
    icon: iconDensidadTec,
    label: 'Alta Densidad Tecnológica',
    desc: 'Más de 15 dispositivos electromédicos operando en simultáneo, con gases, energía de alta frecuencia y líquidos.',
    color: GO,
    glow: 'rgba(251,191,36,0.16)',
    l: 1016, t: 432,
    facts: [
      { stat: '15+', label: 'equipos electromédicos simultáneos' },
      { stat: '4', label: 'servicios críticos: gases, energía, datos, líquidos' },
    ],
  },
]

export default function S03a_Intro() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Control" side="right" size={250} top={-14} opacity={0.026} />
      {pillars.map(p => (
        <Halo key={p.label} x={p.l + 150} y={p.t + 150} size={620} color={p.glow} />
      ))}

      <At l={96} t={92} w={860} anim="none">
        <Title size={55} d={0}>
          El quirófano: el ambiente más <Ac>controlado</Ac> del hospital
        </Title>
      </At>

      {/* La diagonal que pasa por los tres escalones */}
      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 40, top: 292, width: 1500, height: 1,
            background: `linear-gradient(90deg, ${CY}00, ${CY}40 22%, ${VI}40 55%, ${GO}40 82%, transparent)`,
            transform: 'rotate(12.5deg)', transformOrigin: 'left center', ...dly(3),
          }}
        />
      </At>

      {pillars.map((p, i) => (
        <At key={p.label} l={p.l} t={p.t} w={330} d={2 + i * 2} anim="rise">
          <Icon src={p.icon} size={54} color={p.color} d={2 + i * 2} />
          <h3
            className="font-display"
            style={{
              fontSize: 27, margin: '18px 0 12px', color: p.color, lineHeight: 1.1,
              textShadow: `0 0 30px ${p.color}55`,
            }}
          >
            {p.label}
          </h3>
          <div
            className="span-x"
            style={{ width: 120, height: 1, background: `linear-gradient(90deg, ${p.color}80, transparent)`, marginBottom: 14, ...dly(3 + i * 2) }}
          />
          <p style={{ fontSize: 14.5, color: WD, lineHeight: 1.68, margin: '0 0 22px', fontWeight: 300 }}>
            {p.desc}
          </p>
          {p.facts.map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 9 }}>
              <span
                className="font-display"
                style={{ fontSize: 23, color: p.color, textShadow: `0 0 18px ${p.color}55`, minWidth: 56, flexShrink: 0 }}
              >
                {f.stat}
              </span>
              <span style={{ fontSize: 12, color: WF, lineHeight: 1.5 }}>{f.label}</span>
            </div>
          ))}
        </At>
      ))}
    </div>
  )
}
