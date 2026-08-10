import { SlideLayout, SlideTag, SlideTitle, Crimson, Step, Panel } from './SlideLayout'
import RegistroFicha from './RegistroFicha'

export default function S30_AC_Practica() {
  const PASOS = [
    ['Recepción', 'Datos del equipo, tipo de purga (gravedad o prevacío) y ciclos que ejecuta.'],
    ['Estado inicial', 'Revisar el registro de los últimos ciclos y los códigos de error del control.'],
    ['Enfriar y despresurizar', 'Manómetro en cero, cámara fría, equipo desconectado y etiquetado.'],
    ['Drenar', 'Vaciar depósito y cámara. Retirar y limpiar la coladera de fondo.'],
    ['Empaque', 'Desmontar, limpiar el canal, revisar el labio y montar sin torcerlo.'],
    ['Cámara', 'Limpieza sin cloro. Inspeccionar picaduras y estado del acero.'],
    ['Trampa y purga', 'Verificar evacuación del condensado y limpiar el filtro de aire.'],
    ['Resistencias', 'Continuidad, aislamiento y estado de bornes. Descalcificar si corresponde.'],
    ['Cargar agua', 'Sólo desmineralizada. Verificar nivel y sensor de bajo nivel.'],
    ['Ciclo de prueba', 'Cámara vacía con datalogger. Comparar contra manómetro y termómetro patrón.'],
    ['Seguridades', 'Válvula de alivio y enclavamiento de puerta. Bowie‑Dick si es prevacío.'],
    ['Liberar', 'Indicador biológico, seguridad eléctrica, etiqueta y bitácora firmada.'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">04 · Esterilizador — práctica guiada</SlideTag>
      <SlideTitle size="md">
        <span>Doce pasos, y </span>
        <Crimson><span>los tres primeros son de seguridad</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, flex: 1, minHeight: 0 }}>
        <Panel label="Secuencia de taller · aproximadamente 90 min más el ciclo de prueba" tone="crimson" style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {PASOS.map(([t, d], i) => (
              <Step key={t} n={i + 1} title={t} tone={i < 3 ? 'crimson' : i >= 9 ? 'mint' : 'frost'}>
                {d}
              </Step>
            ))}
          </div>
        </Panel>

        <RegistroFicha
          equipo="Esterilizador de vapor"
          nota="Sin resultado del indicador biológico, el equipo queda «en observación», no «apto»."
          campos={[
            ['Ciclo verificado', '121 / 134 °C'],
            ['Temperatura patrón', '°C'],
            ['Temperatura del equipo', '°C'],
            ['Presión patrón', 'bar'],
            ['Tiempo de meseta', 'min'],
            ['Fuga de vacío', 'mbar/min'],
            ['Bowie‑Dick', 'pasa / no pasa'],
            ['Válvula de alivio', 'pasa / no pasa'],
            ['Indicador biológico', 'negativo / positivo'],
            ['Empaque', 'limpiado / cambiado'],
          ]}
        />
      </div>
    </SlideLayout>
  )
}
