import EtapaCadena from './EtapaCadena'
import { Glass, Chip, Hydro, Lunar, Panel } from './SlideLayout'

/** Etapa 1 — alimentación. El primer sospechoso ante «no enciende». */
export default function S14_Alimentacion() {
  const CADENA = ['Entrada de red · fusibles y filtro EMI', 'Transformador o fuente conmutada', 'Rectificación', 'Regulación', 'Distribución']
  const TENSIONES = [
    { v: '+5 V', d: 'lógica' },
    { v: '±12 V / ±15 V', d: 'analógica y amplificadores operacionales' },
    { v: 'buses de potencia', d: 'motores, calefactores' },
  ]

  return (
    <EtapaCadena
      num="2.1"
      activo={0}
      titulo={
        <>
          <span>Alimentación:</span> <Hydro><span>de la red a las tensiones internas</span></Hydro>
        </>
      }
      principio={
        <span>
          Convierte la energía de red —o de batería— en las tensiones reguladas que el equipo necesita. Incluye la
          gestión de batería y el respaldo.
        </span>
      }
      fallas={[
        <>Fusible abierto.</>,
        <>
          Capacitor de filtro degradado, con <Lunar>rizado excesivo</Lunar>: se secan con la edad.
        </>,
        <>Regulador en corto.</>,
        <>Batería agotada.</>,
        <>
          Primer sospechoso ante «no enciende» o comportamiento errático al alimentar por batería.
        </>,
      ]}
    >
      <Panel label="Etapas típicas">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {CADENA.map((c, i) => (
            <span key={c} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Chip tone="hydro">{c}</Chip>
              {i < CADENA.length - 1 && (
                <span style={{ color: 'var(--hydro)', fontSize: 12, opacity: 0.6 }}>→</span>
              )}
            </span>
          ))}
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Glass tone="hydro" ornament style={{ padding: '15px 18px' }}>
          <div
            className="font-mono"
            style={{ fontSize: 9.5, letterSpacing: '0.15em', color: 'var(--hydro)', textTransform: 'uppercase', marginBottom: 10 }}
          >
            <span>Tensiones internas habituales</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TENSIONES.map(t => (
              <div key={t.v} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span className="font-mono" style={{ fontSize: 12.5, color: 'var(--cyan)', minWidth: 108 }}>
                  <span>{t.v}</span>
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.45 }}>
                  <span>{t.d}</span>
                </span>
              </div>
            ))}
          </div>
        </Glass>

        <Glass tone="violet" ornament style={{ padding: '15px 18px' }}>
          <div
            className="font-mono"
            style={{ fontSize: 9.5, letterSpacing: '0.15em', color: 'var(--lilac)', textTransform: 'uppercase', marginBottom: 10 }}
          >
            <span>Componentes críticos</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
            <span>
              Fusibles, puente rectificador, capacitores de filtro —se secan con la edad—, reguladores y la batería,
              de vida limitada.
            </span>
          </p>
        </Glass>
      </div>
    </EtapaCadena>
  )
}
