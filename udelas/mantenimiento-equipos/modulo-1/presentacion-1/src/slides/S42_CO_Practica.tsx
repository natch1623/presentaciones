import { SlideLayout, SlideTag, SlideTitle, Frost, Step, Panel } from './SlideLayout'
import RegistroFicha from './RegistroFicha'

export default function S42_CO_Practica() {
  const PASOS = [
    ['Recepción', 'Datos del equipo, tipo de sensor de CO₂ y tipo de camisa. Revisar la bitácora.'],
    ['Estado inicial', 'Anotar las tres variables del display y la presión del cilindro.'],
    ['Verificar antes', 'CO₂ con analizador y temperatura con patrón, sin haber intervenido nada.'],
    ['Prueba de fuga', 'Solución jabonosa en marco de puerta y racores de la línea.'],
    ['Prueba del papel', 'Recorrer todo el perímetro del empaque cada 10 cm.'],
    ['Retirar y limpiar', 'Bandejas, bandeja de agua y superficies interiores.'],
    ['Filtros', 'Reemplazar HEPA interno y filtro de línea de 0,2 µm. Fecharlos.'],
    ['Descontaminar', 'Ciclo del equipo o procedimiento manual, con la cámara vacía.'],
    ['Estabilizar', 'Reponer agua destilada estéril y dejar el equipo cerrado el tiempo requerido.'],
    ['Calibrar', 'CO₂ y temperatura contra patrón, ya con la cámara estable.'],
    ['Recuperación', 'Abrir 30 s, cronometrar el retorno y comparar con el histórico.'],
    ['Liberar', 'Probar alarmas, seguridad eléctrica, etiqueta y bitácora firmada.'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="mint">06 · Incubadora de CO₂ — práctica guiada</SlideTag>
      <SlideTitle size="md">
        <span>Doce pasos, y </span>
        <Frost><span>la espera también es parte del procedimiento</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, flex: 1, minHeight: 0 }}>
        <Panel label="Secuencia de taller · dos sesiones por el tiempo de estabilización" tone="mint" style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {PASOS.map(([t, d], i) => (
              <Step key={t} n={i + 1} title={t} tone={i >= 9 ? 'mint' : 'frost'}>
                {d}
              </Step>
            ))}
          </div>
        </Panel>

        <RegistroFicha
          equipo="Incubadora de CO₂"
          nota="Si el sensor es de conductividad térmica, la calibración sin estabilización previa no vale: anotar la hora de cada lectura."
          campos={[
            ['Tipo de sensor', 'TC / IR'],
            ['CO₂ display', '%'],
            ['CO₂ patrón', '%'],
            ['Temperatura display', '°C'],
            ['Temperatura patrón', '°C'],
            ['Uniformidad', '°C máx.'],
            ['Recuperación de CO₂', 'min'],
            ['Prueba de fuga', 'pasa / no pasa'],
            ['Filtros', 'reemplazados / fecha'],
            ['Descontaminación', 'fecha'],
          ]}
        />
      </div>
    </SlideLayout>
  )
}
