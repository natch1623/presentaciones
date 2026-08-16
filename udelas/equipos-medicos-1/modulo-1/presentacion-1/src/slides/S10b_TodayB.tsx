import { At, Ghost, Halo, Icon, Eyebrow, CYM, VID, GO, GOD, WD, dly } from './Stage'
import iconIntegracion from '../assets/icons/s10-03-integracion.png'
import iconIA from '../assets/icons/s10-04-ia.png'
import iconModular from '../assets/icons/s10-05-modular.png'

const trends = [
  {
    icon: iconIntegracion, title: 'OR Integration',
    desc: 'Video, datos y control de ambiente convergen en un sistema central conectado al expediente electrónico.',
    color: CYM, glow: 'rgba(56,189,248,0.16)', l: 96, t: 168,
  },
  {
    icon: iconIA, title: 'IA Intraoperatoria',
    desc: 'Integración de robótica e IA mejora la precisión quirúrgica y la eficiencia del flujo de trabajo.',
    color: '#9f7aea', glow: 'rgba(109,40,217,0.2)', l: 556, t: 250,
  },
  {
    icon: iconModular, title: 'Diseño Modular',
    desc: 'Paneles prefabricados de pared/techo (acero inoxidable, superficie sólida o vidrio) con pases de instalaciones integrados: instalación más rápida y superficies antimicrobianas fáciles de reconfigurar.',
    color: GO, glow: 'rgba(251,191,36,0.14)', l: 1016, t: 332,
  },
]

export default function S10b_TodayB() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Integrado" side="left" size={190} top={-6} opacity={0.024} />
      {trends.map(t => (
        <Halo key={t.title} x={t.l + 150} y={t.t + 130} size={580} color={t.glow} />
      ))}

      <At l={100} t={98} anim="none">
        <Eyebrow d={0}>El quirófano hoy · continuación</Eyebrow>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 30, top: 196, width: 1500, height: 1,
            backgroundImage: `linear-gradient(90deg, transparent, ${CYM}38 22%, ${VID}55 55%, ${GO}38 82%, transparent)`,
            transform: 'rotate(12.5deg)', transformOrigin: 'left center', ...dly(2),
          }}
        />
      </At>

      {trends.map((t, i) => (
        <At key={t.title} l={t.l} t={t.t} w={330} d={2 + i * 2} anim="rise">
          <Icon src={t.icon} size={48} color={t.color} d={2 + i * 2} />
          <h3
            className="font-display"
            style={{ fontSize: 27, color: t.color, margin: '18px 0 12px', lineHeight: 1.1, textShadow: `0 0 28px ${t.color}55` }}
          >
            {t.title}
          </h3>
          <div
            className="span-x"
            style={{ width: 110, height: 1, background: `linear-gradient(90deg, ${t.color}88, transparent)`, marginBottom: 14, ...dly(3 + i * 2) }}
          />
          <p style={{ fontSize: 14.5, color: WD, lineHeight: 1.68, margin: 0, fontWeight: 300 }}>
            {t.desc}
          </p>
        </At>
      ))}

      <At l={100} t={676} w={1220} d={9}>
        <div style={{ paddingLeft: 20, borderLeft: `2px solid ${GOD}` }}>
          <p style={{ fontSize: 15, color: WD, margin: 0, lineHeight: 1.66 }}>
            <strong style={{ color: GO }}>📌 Contexto Panamá:</strong>{' '}
            La Ciudad de la Salud (CSS) incorporó cirugía robótica en su Bloque Central. Hospitales de tercer
            nivel (Santo Tomás, Complejo AAM, Hospital del Niño) operan en distintos grados de integración tecnológica.
          </p>
        </div>
      </At>
    </div>
  )
}
