import { SlideLayout, SlideTag, SlideTitle, Frost, Panel, Figure, Callout, Stat } from './SlideLayout'

/**
 * Documentación. Se cierra con esto porque una intervención sin
 * registro no existe para el hospital: ni para la auditoría, ni para
 * el presupuesto del año siguiente, ni para el técnico que venga
 * después.
 */
export default function S44_Registro() {
  const ORDEN = [
    ['Identificación', 'Marca, modelo, serie, código de inventario y ubicación exacta.'],
    ['Motivo', 'Preventivo programado, correctivo o verificación. Quién lo solicitó y cuándo.'],
    ['Estado inicial', 'Cómo llegó el equipo, con evidencia: lectura, foto o registro del ciclo.'],
    ['Trabajo realizado', 'Qué se limpió, ajustó o reemplazó. Repuestos con su número de parte.'],
    ['Valores medidos', 'Cada magnitud con su valor, su unidad y la tolerancia contra la que se comparó.'],
    ['Instrumento usado', 'Cuál, con qué número de serie y con qué fecha de calibración.'],
    ['Resultado', 'Apto, en observación o fuera de servicio. Sin términos intermedios.'],
    ['Cierre', 'Firma del técnico, fecha, tiempo empleado y fecha del próximo servicio.'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="mint">Cierre · documentación</SlideTag>
      <SlideTitle size="md">
        <span>La intervención que no se registra </span>
        <Frost><span>no ocurrió</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 28, flex: 1, minHeight: 0 }}>
        <Panel label="Los ocho campos de la orden de trabajo" tone="frost" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {ORDEN.map(([k, v], i) => (
              <div
                key={k}
                className="stagger-item"
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'baseline',
                  paddingBottom: 8,
                  borderBottom: i < ORDEN.length - 1 ? '1px solid rgba(234,246,255,0.06)' : 'none',
                }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: 10, color: 'var(--frost)', minWidth: 18, letterSpacing: '0.06em' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ice)', fontWeight: 500, minWidth: 146 }}>
                  <span>{k}</span>
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--ice-dim)', lineHeight: 1.5, flex: 1 }}>
                  <span>{v}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, minWidth: 0 }}>
          <Panel label="Lo que sale del registro" tone="rift">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Stat value="%" label="Cumplimiento del programa preventivo" tone="frost" />
              <Stat value="h" label="Tiempo de parada acumulado por equipo" tone="crimson" />
              <Stat value="↗" label="Deriva de calibración entre visitas" tone="amber" />
              <Stat value="$" label="Reposición justificada con historial" tone="mint" />
            </div>
          </Panel>

          <Figure
            tone="mint"
            height={124}
            file="etiqueta-servicio.jpg"
            hint="Etiqueta de servicio pegada al equipo, con fecha, técnico y próximo mantenimiento."
            caption="La etiqueta es la parte del registro que el usuario sí lee."
          />

          <Callout kind="mint" title="Escribir el número, no el adjetivo">
            «Funcionando correctamente» no sirve dentro de seis meses. «3 480 rpm sobre 3 500
            nominal, −0,6 %» permite ver la deriva en la próxima visita y anticipar la falla.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
