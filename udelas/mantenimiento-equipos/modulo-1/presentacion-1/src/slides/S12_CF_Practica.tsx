import { SlideLayout, SlideTag, SlideTitle, Frost, Step, Panel } from './SlideLayout'
import RegistroFicha from './RegistroFicha'

/**
 * Práctica guiada: la rutina completa en el orden en que se ejecuta,
 * con la ficha que hay que entregar llena al final. Cierra el bloque
 * de la centrífuga.
 */
export default function S12_CF_Practica() {
  const PASOS = [
    ['Recepción', 'Orden de trabajo, marca, modelo, serie e inventario. Confirmar que llegó descontaminada.'],
    ['Estado inicial', 'Ciclo de prueba de 2 min. Anotar ruido, vibración, lectura del display y frenado.'],
    ['Aislar', 'Desconectar el cordón y colocar tarjeta de bloqueo.'],
    ['Desmontar rotor', 'Aflojar la tuerca, extraer y revisar cada pozo con linterna.'],
    ['Limpiar', 'Detergente neutro en cuba y rotor. Secar el rotor boca abajo.'],
    ['Revisar accesorios', 'Copas, adaptadores y portatubos: descartar todo lo agrietado.'],
    ['Montar rotor', 'Lubricar rosca y asiento; apretar al par indicado.'],
    ['Base', 'Amortiguadores, pies y nivelación con burbuja.'],
    ['Interior', 'Medir escobillas, soplar polvo, revisar bornes y conexiones.'],
    ['Medir', 'rpm con tacómetro y tiempo con cronómetro. Anotar los valores.'],
    ['Probar seguridades', 'Enclavamiento de tapa y detección de desbalance.'],
    ['Liberar', 'Seguridad eléctrica, etiqueta con fecha y próximo servicio, bitácora firmada.'],
  ]

  return (
    <SlideLayout>
      <SlideTag>01 · Centrífuga — práctica guiada</SlideTag>
      <SlideTitle size="md">
        <span>Doce pasos, </span>
        <Frost><span>y la ficha se entrega llena</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, flex: 1, minHeight: 0 }}>
        <Panel label="Secuencia de taller · aproximadamente 50 min" tone="frost" style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {PASOS.map(([t, d], i) => (
              <Step key={t} n={i + 1} title={t} tone={i >= 9 ? 'mint' : 'frost'}>
                {d}
              </Step>
            ))}
          </div>
        </Panel>

        <RegistroFicha
          equipo="Centrífuga"
          campos={[
            ['rpm nominal', 'rpm'],
            ['rpm medida', 'rpm'],
            ['Desviación', '%'],
            ['Tiempo programado', 'min'],
            ['Tiempo medido', 'min'],
            ['Escobilla', 'mm'],
            ['Resistencia de tierra', 'Ω'],
            ['Enclavamiento', 'pasa / no pasa'],
            ['Desbalance', 'pasa / no pasa'],
          ]}
        />
      </div>
    </SlideLayout>
  )
}
