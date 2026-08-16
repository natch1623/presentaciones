import { At, Ghost, Halo, Icon, Eyebrow, CY, WD, dly } from './Stage'
import iconHistoria from '../assets/icons/s02-01-historia.png'
import iconSistema from '../assets/icons/s02-02-sistema.png'
import iconZonificacion from '../assets/icons/s02-03-zonificacion.png'
import iconParametros from '../assets/icons/s02-04-parametros.png'
import iconBiomedico from '../assets/icons/s02-05-biomedico.png'

/**
 * Los cinco objetivos. Cada uno arranca en una sangría distinta:
 * la columna deja de ser una columna y se vuelve una escalera, que
 * es lo que impide que cinco líneas seguidas se lean como una
 * tabla de contenidos.
 */
const objectives = [
  { num: '01', text: 'Explicar la evolución histórica del acto quirúrgico y su relación directa con el desarrollo tecnológico del quirófano.', icon: iconHistoria, l: 100 },
  { num: '02', text: 'Definir el salón de operaciones como un sistema técnico-clínico integrado, no solo como un espacio físico.', icon: iconSistema, l: 148 },
  { num: '03', text: 'Identificar la zonificación quirúrgica (negra, gris, blanca) y justificar su función en el control de infecciones.', icon: iconZonificacion, l: 116 },
  { num: '04', text: 'Reconocer los parámetros ambientales, eléctricos y de gases medicinales que debe cumplir un quirófano.', icon: iconParametros, l: 164 },
  { num: '05', text: 'Ubicar el rol del ingeniero biomédico dentro del ciclo de vida del equipamiento quirúrgico.', icon: iconBiomedico, l: 128 },
]

export default function S02b_ObjectivesList() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="05" side="right" size={460} top={130} opacity={0.03} />
      <Halo x={1200} y={620} size={760} color="rgba(109,40,217,0.2)" />
      <Halo x={140} y={160} size={520} color="rgba(0,212,255,0.13)" />

      <At l={100} t={86} anim="none">
        <Eyebrow d={0}>El estudiante será capaz de</Eyebrow>
      </At>

      {/* Diagonal que atraviesa la escalera por detrás */}
      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 40, top: 760, width: 1460, height: 1,
            background: `linear-gradient(90deg, transparent, ${CY}26 45%, transparent)`,
            transform: 'rotate(-27deg)', transformOrigin: 'left center', ...dly(3),
          }}
        />
      </At>

      {objectives.map((o, i) => (
        <At key={o.num} l={o.l} t={152 + i * 122} w={1440 - o.l - 110} d={2 + i} anim="drift">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22 }}>
            <span
              className="font-mono"
              style={{ fontSize: 13, color: CY, opacity: 0.45, paddingTop: 12, flexShrink: 0, letterSpacing: '0.06em' }}
            >
              {o.num}
            </span>
            <Icon src={o.icon} size={42} d={2 + i} style={{ flexShrink: 0, marginTop: 2 }} />
            <p
              style={{
                fontSize: 20, fontWeight: 300, lineHeight: 1.58, color: WD, margin: 0, maxWidth: 780,
              }}
            >
              {o.text}
            </p>
          </div>
          <div
            className="span-x"
            style={{
              width: 300, height: 1, marginTop: 20, marginLeft: 35,
              background: `linear-gradient(90deg, ${CY}30, transparent)`,
              ...dly(3 + i),
            }}
          />
        </At>
      ))}
    </div>
  )
}
