import { SlideLayout, SlideTag, SlideTitle, Frost, Panel, Figure, Badge } from './SlideLayout'

/**
 * Objetivos redactados como acciones verificables. «Conocer» no se
 * puede evaluar en un taller; «medir y aceptar contra una tolerancia»,
 * sí — y es lo que el técnico va a tener que hacer en el laboratorio.
 */
export default function S03_Objetivos() {
  const OBJ = [
    {
      v: 'Intervenir',
      t: 'Ejecutar la rutina preventiva completa de los seis equipos, con su frecuencia y su secuencia.',
      b: 'Rutina',
    },
    {
      v: 'Medir',
      t: 'Usar tacómetro, anemómetro, termómetro patrón, analizador de CO₂ y analizador de seguridad eléctrica.',
      b: 'Instrumentos',
    },
    {
      v: 'Decidir',
      t: 'Comparar la lectura contra la tolerancia y declarar el equipo apto, en observación o fuera de servicio.',
      b: 'Criterio',
    },
    {
      v: 'Diagnosticar',
      t: 'Ir del síntoma a la causa probable sin cambiar piezas a ciegas.',
      b: 'Falla',
    },
    {
      v: 'Proteger',
      t: 'Aplicar bioseguridad, corte de energía y manejo de presión antes de abrir cualquier equipo.',
      b: 'Seguridad',
    },
    {
      v: 'Registrar',
      t: 'Dejar el valor medido, la acción hecha y la fecha del próximo servicio en la bitácora del equipo.',
      b: 'Trazabilidad',
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>Resultado esperado</SlideTag>
      <SlideTitle size="md">
        <span>Al cerrar el módulo, </span>
        <Frost><span>esto lo tienes que poder hacer solo</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 26, flex: 1, minHeight: 0 }}>
        {/* ── Lista de objetivos, sin cajas: sólo filo y verbo ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, minWidth: 0 }}>
          {OBJ.map((o, i) => (
            <div
              key={o.v}
              className="stagger-item"
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'baseline',
                paddingBottom: 10,
                borderBottom: i < OBJ.length - 1 ? '1px solid rgba(234,246,255,0.07)' : 'none',
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: 22,
                  color: 'var(--frost)',
                  minWidth: 118,
                  lineHeight: 1.1,
                  textShadow: '0 0 20px rgba(143,220,255,0.35)',
                }}
              >
                <span>{o.v}</span>
              </span>
              <span style={{ fontSize: 12.5, color: 'var(--ice-dim)', lineHeight: 1.55, flex: 1 }}>
                <span>{o.t}</span>
              </span>
              <Badge tone={i === 4 ? 'crimson' : i === 5 ? 'mint' : 'rift'}>{o.b}</Badge>
            </div>
          ))}
        </div>

        {/* ── Hueco para la foto del taller ── */}
        <Panel label="El taller" tone="rift">
          <Figure
            tone="rift"
            file="taller-laboratorio.jpg"
            hint="Foto del laboratorio o del banco de trabajo donde se hará la práctica del módulo."
            caption="La rutina se aprende con el equipo abierto y el instrumento en la mano, no en la diapositiva."
          />
        </Panel>
      </div>
    </SlideLayout>
  )
}
