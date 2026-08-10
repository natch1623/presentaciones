import { SlideLayout, SlideTag, SlideTitle, Rift, Step, Panel } from './SlideLayout'
import RegistroFicha from './RegistroFicha'

export default function S24_FL_Practica() {
  const PASOS = [
    ['Recepción', 'Datos del equipo y tipo: flujo laminar o bioseguridad Clase II. Uso al que está destinada.'],
    ['Encender', 'Dejar 15 min en régimen antes de cualquier medición.'],
    ['Estado inicial', 'Leer el manómetro y anotar horas de UV y del ventilador.'],
    ['Rejillas', 'Despejar el frente y retirar todo lo apoyado sobre el plano.'],
    ['Cuadrícula', 'Nueve puntos con anemómetro. Anotar cada valor, no sólo el promedio.'],
    ['Uniformidad', 'Calcular la media y verificar que ningún punto se aparte más de ±20 %.'],
    ['Prueba de humo', 'Recorrer frente y zona de trabajo. Grabar el video.'],
    ['Apagar y aislar', 'Desconectar antes de abrir el compartimiento del prefiltro.'],
    ['Prefiltro', 'Retirar, lavar o reemplazar, secar y montar en la orientación correcta.'],
    ['Lámpara UV', 'Limpiar con alcohol y medir intensidad con radiómetro.'],
    ['Verificar', 'Repetir la cuadrícula con el prefiltro limpio y comparar con la lectura inicial.'],
    ['Liberar', 'Seguridad eléctrica, etiqueta, bitácora y fecha de la próxima certificación del HEPA.'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="rift">03 · Flujo laminar — práctica guiada</SlideTag>
      <SlideTitle size="md">
        <span>Doce pasos y </span>
        <Rift><span>nueve valores anotados uno por uno</span></Rift>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, flex: 1, minHeight: 0 }}>
        <Panel label="Secuencia de taller · aproximadamente 60 min" tone="rift" style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {PASOS.map(([t, d], i) => (
              <Step key={t} n={i + 1} title={t} tone={i >= 10 ? 'mint' : 'rift'}>
                {d}
              </Step>
            ))}
          </div>
        </Panel>

        <RegistroFicha
          equipo="Cámara de flujo laminar"
          nota="Los nueve valores van completos en la ficha: el promedio solo no permite detectar la zona muerta."
          campos={[
            ['Tipo de cabina', 'LF / BSC II'],
            ['Velocidad media', 'm/s'],
            ['Punto más bajo', 'm/s'],
            ['Desviación máxima', '%'],
            ['Presión diferencial', 'Pa'],
            ['Prueba de humo', 'pasa / no pasa'],
            ['Intensidad UV', 'µW/cm²'],
            ['Horas de UV', 'h'],
            ['Prefiltro', 'limpiado / cambiado'],
            ['Próxima certificación HEPA', 'fecha'],
          ]}
        />
      </div>
    </SlideLayout>
  )
}
