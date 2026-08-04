import { SlideLayout, SlideTitle, CyanAccent } from './SlideLayout'
import iconHibrido from '../assets/icons/s10-01-hibrido.png'
import iconRobotica from '../assets/icons/s10-02-robotica.png'
import iconIntegracion from '../assets/icons/s10-03-integracion.png'
import iconIA from '../assets/icons/s10-04-ia.png'
import iconModular from '../assets/icons/s10-05-modular.png'

const trends = [
  {
    icon: iconHibrido, title: 'Quirófano Híbrido',
    desc: 'Integra equipo quirúrgico e imagen intraoperatoria avanzada (angiógrafo, TC o RM) en la misma sala. Opera y verifica antes de cerrar.',
    color: '#00d4ff', span: 2,
  },
  {
    icon: iconRobotica, title: 'Cirugía Robótica',
    desc: 'Intuitive Surgical: 70–80% del mercado, >6,730 sistemas (2021). Nuevos: Hugo RAS (Medtronic) y Toumai (MicroPort MedBot, China) — puerto único, primer sistema aprobado para telecirugía comercial.',
    color: '#a78bfa', span: 1,
  },
  {
    icon: iconIntegracion, title: 'OR Integration',
    desc: 'Video, datos y control de ambiente convergen en un sistema central conectado al expediente electrónico.',
    color: '#38bdf8', span: 1,
  },
  {
    icon: iconIA, title: 'IA Intraoperatoria',
    desc: 'Integración de robótica e IA mejora la precisión quirúrgica y la eficiencia del flujo de trabajo.',
    color: '#6d28d9', span: 1,
  },
  {
    icon: iconModular, title: 'Diseño Modular',
    desc: 'Paneles prefabricados de pared/techo (acero inoxidable, superficie sólida o vidrio) con pases de instalaciones integrados: instalación más rápida y superficies antimicrobianas fáciles de reconfigurar.',
    color: '#fbbf24', span: 1,
  },
]

export default function S10_Today() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        El quirófano hoy: <CyanAccent>híbrido, integrado, digital</CyanAccent>
      </SlideTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: 14, flex: 1,
        }}
      >
        {trends.map((t, i) => (
          <div
            key={t.title}
            className="card-hover"
            style={{
              gridColumn: i === 0 ? 'span 2' : undefined,
              background: `linear-gradient(135deg, rgba(10,26,74,0.8), rgba(6,15,46,0.95))`,
              border: `1px solid ${t.color}25`,
              borderTop: `2px solid ${t.color}`,
              borderRadius: 12,
              padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 10,
              position: 'relative', overflow: 'hidden',
              animation: `scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.1}s both`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 30px ${t.color}06`,
            }}
          >
            {/* Glow corner */}
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 80,
                background: `radial-gradient(ellipse at 40% -30%, ${t.color}12 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                width: i === 0 ? 46 : 36, height: i === 0 ? 46 : 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <img
                src={t.icon}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 0 10px ${t.color})` }}
              />
            </div>
            <h3 style={{ fontSize: i === 0 ? 17 : 14, color: t.color, margin: 0, fontWeight: 600, textShadow: `0 0 16px ${t.color}50` }}>
              {t.title}
            </h3>
            <p style={{ fontSize: i === 0 ? 14 : 12.5, color: 'var(--white-dim)', margin: 0, lineHeight: 1.65 }}>
              {t.desc}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 12, padding: '12px 18px',
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.22)',
          borderLeft: '3px solid #f59e0b',
          borderRadius: 8,
          animation: 'fadeSlideUp 0.45s ease 0.6s both',
        }}
      >
        <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.9)', margin: 0, lineHeight: 1.6 }}>
          <strong>📌 Contexto Panamá:</strong>{' '}
          <span style={{ color: 'var(--white-dim)' }}>
            La Ciudad de la Salud (CSS) incorporó cirugía robótica en su Bloque Central. Hospitales de tercer nivel (Santo Tomás, Complejo AAM, Hospital del Niño) operan en distintos grados de integración tecnológica.
          </span>
        </p>
      </div>
    </SlideLayout>
  )
}
