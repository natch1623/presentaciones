import { SlideLayout, SlideTag, SlideTitle, Crimson, SpecTable, Panel, Callout, Figure } from './SlideLayout'

export default function S41_CO_Fallas() {
  const FALLAS: [string, string, string][] = [
    [
      'No alcanza el CO₂ ajustado',
      'Cilindro agotado · regulador mal ajustado · filtro de línea tapado · solenoide · fuga en el empaque',
      'Verificar presión de entrada y cambiar el filtro de línea.',
    ],
    [
      'El CO₂ oscila sin motivo',
      'Aperturas frecuentes · sensor TC afectado por humedad · fuga intermitente',
      'Revisar el registro de aperturas antes de tocar la calibración.',
    ],
    [
      'El cilindro dura mucho menos',
      'Fuga en el empaque de puerta o en las conexiones de la línea',
      'Prueba de burbuja con solución jabonosa en marco y racores.',
    ],
    [
      'Temperatura por debajo del ajustado',
      'Puerta mal cerrada · resistencia · control · sonda mal ubicada · sala muy fría',
      'Probar el empaque con una hoja de papel en todo el perímetro.',
    ],
    [
      'Contaminación recurrente',
      'Bandeja de agua · filtro HEPA vencido · empaque poroso · técnica del usuario',
      'Descontaminación completa y reemplazo de filtros el mismo día.',
    ],
    [
      'Condensación excesiva en el vidrio',
      'Puerta interior más fría que la cámara · exceso de agua · ambiente frío',
      'Ajustar el nivel de la bandeja y revisar la calefacción de puerta.',
    ],
    [
      'Lectura de CO₂ falsa tras descontaminar',
      'Sensor de conductividad térmica sin estabilizar ni recalibrar',
      'Esperar 12–24 h y recalibrar con analizador independiente.',
    ],
    [
      'Alarma de puerta permanente',
      'Sensor o imán de puerta · desalineación de la bisagra',
      'Verificar el cierre físico antes de sospechar del control.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">06 · Incubadora de CO₂ — diagnóstico</SlideTag>
      <SlideTitle size="md">
        <span>La incubadora avisa tarde: </span>
        <Crimson><span>el cultivo se pierde antes que suene la alarma</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Síntoma', 'Causa probable — en orden de descarte', 'Primera acción']}
            cols="0.98fr 1.5fr 1.05fr"
            rows={FALLAS}
            fontSize={10.4}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Panel label="La prueba del papel" tone="mint">
            <p style={{ fontSize: 11, color: 'var(--ice-dim)', lineHeight: 1.55, margin: 0 }}>
              <span>
                Cerrar la puerta sobre una hoja de papel y tirar. Repetir cada 10 cm alrededor del
                marco: donde el papel sale sin resistencia, el empaque perdió sello. Cuesta un
                minuto y explica la mayoría de las fugas de CO₂.
              </span>
            </p>
          </Panel>

          <Figure
            tone="crimson"
            height={132}
            file="incubadora/empaque-puerta.jpg"
            hint="Empaque de la puerta interior, con el detalle de una zona aplastada o agrietada."
          />

          <Callout kind="amber" title="Antes de recalibrar el sensor">
            Descartar fuga y filtro tapado. Recalibrar sobre un equipo con fuga sólo esconde el
            problema unos días y deja el registro de calibración sin valor.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
