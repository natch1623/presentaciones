import { SlideLayout, SlideTitle, CyanAccent } from './SlideLayout'
import iconHistoria from '../assets/icons/s02-01-historia.png'
import iconSistema from '../assets/icons/s02-02-sistema.png'
import iconZonificacion from '../assets/icons/s02-03-zonificacion.png'
import iconParametros from '../assets/icons/s02-04-parametros.png'
import iconBiomedico from '../assets/icons/s02-05-biomedico.png'
import modernOrPhoto from '../assets/photos/modern-or-surgery.jpg'

const objectives = [
  { num: '01', text: 'Explicar la evolución histórica del acto quirúrgico y su relación directa con el desarrollo tecnológico del quirófano.', icon: iconHistoria },
  { num: '02', text: 'Definir el salón de operaciones como un sistema técnico-clínico integrado, no solo como un espacio físico.', icon: iconSistema },
  { num: '03', text: 'Identificar la zonificación quirúrgica (negra, gris, blanca) y justificar su función en el control de infecciones.', icon: iconZonificacion },
  { num: '04', text: 'Reconocer los parámetros ambientales, eléctricos y de gases medicinales que debe cumplir un quirófano.', icon: iconParametros },
  { num: '05', text: 'Ubicar el rol del ingeniero biomédico dentro del ciclo de vida del equipamiento quirúrgico.', icon: iconBiomedico },
]

export default function S02_Objectives() {
  return (
    <SlideLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, height: '100%', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
          <SlideTitle>
            Objetivos de <CyanAccent>Aprendizaje</CyanAccent>
          </SlideTitle>
          <p
            style={{ color: 'var(--white-dim)', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}
            className="stagger-item"
          >
            Al finalizar este tema, el estudiante será capaz de:
          </p>
          <div
            className="stagger-item"
            style={{
              padding: '18px 22px',
              background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.18)',
              borderLeft: '3px solid var(--cyan-bright)',
              borderRadius: 10,
            }}
          >
            <p className="font-mono" style={{ fontSize: 12, color: 'var(--cyan-mid)', margin: 0, lineHeight: 1.65 }}>
              💡 <strong>Pregunta de apertura:</strong>{' '}
              <span style={{ color: 'var(--white-dim)', fontStyle: 'italic' }}>
                "¿Qué diferencia a un quirófano de cualquier otro cuarto del hospital?"
              </span>
            </p>
          </div>

          {/* Photo accent */}
          <div
            className="stagger-item card-hover"
            style={{
              marginTop: 20,
              borderRadius: 12,
              overflow: 'hidden',
              flex: 1,
              minHeight: 0,
              border: '1px solid rgba(0,212,255,0.2)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4), 0 0 24px rgba(0,212,255,0.06)',
              position: 'relative',
            }}
          >
            <img
              src={modernOrPhoto}
              alt="Equipo quirúrgico operando en un quirófano moderno"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: 'saturate(0.85) brightness(0.8) contrast(1.05)',
              }}
            />
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(0,212,255,0.1) 0%, transparent 40%, rgba(2,7,26,0.9) 100%)',
              }}
            />
            <p
              className="font-mono"
              style={{
                position: 'absolute', bottom: 8, left: 12, right: 12,
                fontSize: 9.5, color: 'rgba(240,249,255,0.65)', margin: 0, lineHeight: 1.4,
              }}
            >
              Equipo quirúrgico en un quirófano moderno · U.S. Navy — dominio público
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', minHeight: 0 }}>
          {objectives.map((obj, i) => (
            <div
              key={obj.num}
              className="card-hover"
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '13px 17px',
                background: 'linear-gradient(90deg, rgba(10,26,74,0.7), rgba(6,15,46,0.9))',
                border: '1px solid rgba(0,212,255,0.12)',
                borderLeft: '2px solid rgba(0,212,255,0.5)',
                borderRadius: 10,
                animation: `fadeSlideLeft 0.45s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.1}s both`,
              }}
            >
              <div
                style={{
                  width: 34, height: 34, flexShrink: 0, borderRadius: 9,
                  background: 'radial-gradient(circle, rgba(0,212,255,0.14) 0%, transparent 72%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <img
                  src={obj.icon}
                  alt=""
                  style={{ width: 26, height: 26, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.35))' }}
                />
              </div>
              <div>
                <span className="font-mono" style={{ fontSize: 10, color: 'rgba(0,212,255,0.5)', display: 'block', marginBottom: 3 }}>
                  {obj.num}
                </span>
                <p style={{ fontSize: 13, color: 'var(--white-dim)', margin: 0, lineHeight: 1.6 }}>{obj.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
