import { SlideLayout, SlideTag, SlideTitle, Crimson, SpecTable, Panel, Callout, Figure } from './SlideLayout'

export default function S23_FL_Fallas() {
  const FALLAS: [string, string, string][] = [
    [
      'Alarma de flujo bajo',
      'Prefiltro saturado · HEPA colmatado · velocidad del ventilador desajustada · sensor sucio',
      'Cambiar el prefiltro y volver a medir antes de tocar el ventilador.',
    ],
    [
      'Cultivos contaminados sin causa aparente',
      'Fuga en el sello del filtro · rejillas bloqueadas · corriente de aire cruzada en la sala · técnica del usuario',
      'Prueba de humo primero: muestra el reflujo en segundos.',
    ],
    [
      'Presión diferencial en aumento',
      'HEPA acercándose al fin de su vida útil',
      'Programar reemplazo antes de que la velocidad caiga fuera de rango.',
    ],
    [
      'Velocidad correcta pero desigual',
      'Medio filtrante dañado en una zona · obstrucción parcial · sello vencido',
      'Repetir la cuadrícula y localizar el punto bajo; luego prueba de integridad.',
    ],
    [
      'Ruido o vibración nuevos',
      'Rodamientos del ventilador · turbina desbalanceada · montaje flojo',
      'Escuchar en marcha libre y revisar el apriete del conjunto.',
    ],
    [
      'La lámpara UV no enciende',
      'Tubo agotado · balastro o arrancador · enclavamiento de la ventana',
      'Verificar el enclavamiento antes de reemplazar el tubo.',
    ],
    [
      'UV enciende pero no descontamina',
      'Tubo con polvo · horas de uso excedidas · distancia de trabajo mayor a la prevista',
      'Limpiar el tubo y medir con radiómetro; reemplazar por horas, no por si enciende.',
    ],
    [
      'La ventana no sostiene su altura',
      'Contrapesos · cable o polea · riel sucio',
      'Nunca dejarla trabada con un objeto: revisar el mecanismo.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">03 · Flujo laminar — diagnóstico</SlideTag>
      <SlideTitle size="md">
        <span>La cabina que parece funcionar </span>
        <Crimson><span>y no está protegiendo nada</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 266px', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Síntoma', 'Causa probable — en orden de descarte', 'Primera acción']}
            cols="0.92fr 1.5fr 1.1fr"
            rows={FALLAS}
            fontSize={10.5}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Figure
            tone="crimson"
            height={142}
            file="flujo-laminar/prueba-humo.jpg"
            hint="Fotograma de la prueba de humo mostrando el flujo bajando recto sobre la superficie."
            caption="El humo hace visible en segundos lo que el manómetro no dice."
          />

          <Panel label="Lo que casi nunca es" tone="rift">
            <p style={{ fontSize: 11, color: 'var(--ice-dim)', lineHeight: 1.55, margin: 0 }}>
              <span>
                La tarjeta electrónica. Antes de sospechar del control hay tres cosas físicas que
                explican la mayoría de los casos: prefiltro sucio, rejilla tapada y sello vencido.
              </span>
            </p>
          </Panel>

          <Callout kind="crimson" title="Fuera de servicio inmediato">
            Si la prueba de humo muestra aire saliendo hacia el operador en una cabina usada con
            material biológico, la cabina se detiene el mismo día, aunque todos los demás valores
            estén bien.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
