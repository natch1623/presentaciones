import { SlideLayout, SlideTag, SlideTitle, Rift, Step, Panel } from './SlideLayout'
import RegistroFicha from './RegistroFicha'

export default function S36_EL_Practica() {
  const PASOS = [
    ['Recepción', 'Datos del equipo, número de canales y programas de lavado configurados.'],
    ['Estado inicial', 'Ciclo de prueba con agua sobre una placa de descarte. Observar canal por canal.'],
    ['Gravimetría inicial', 'Volumen dispensado y residual, antes de intervenir.'],
    ['Vaciar', 'Frasco de residuos y depósito de buffer. Desinfectar ambos.'],
    ['Purgar', 'Circuito completo con agua destilada hasta que salga limpia.'],
    ['Cabezal', 'Desmontar, remojar, revisar cada aguja a contraluz y enderezar lo que haga falta.'],
    ['Destapar', 'Alambre del fabricante en el sentido del flujo, sólo en el canal afectado.'],
    ['Tubería', 'Revisar el tramo peristáltico y reemplazarlo si está marcado.'],
    ['Trampa y filtro', 'Secar la trampa y reemplazar el filtro hidrofóbico si estuvo mojado.'],
    ['Alinear', 'Centrado sobre los pozos y altura de la aguja aspiradora.'],
    ['Gravimetría final', 'Repetir dispensado y residual. Comparar con la medición inicial.'],
    ['Liberar', 'Seguridad eléctrica, purga final, etiqueta y bitácora firmada.'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="rift">05 · Lavador de ELISA — práctica guiada</SlideTag>
      <SlideTitle size="md">
        <span>Doce pasos, con </span>
        <Rift><span>gravimetría antes y después</span></Rift>
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
          equipo="Lavador de ELISA"
          nota="La comparación antes‑después es la prueba de que la intervención sirvió, no la lista de tareas hechas."
          campos={[
            ['Volumen programado', 'µL/pozo'],
            ['Dispensado inicial', 'µL/pozo'],
            ['Dispensado final', 'µL/pozo'],
            ['Residual inicial', 'µL/pozo'],
            ['Residual final', 'µL/pozo'],
            ['CV entre canales', '%'],
            ['Canales destapados', 'n.º'],
            ['Tubo peristáltico', 'revisado / cambiado'],
            ['Resistencia de tierra', 'Ω'],
          ]}
        />
      </div>
    </SlideLayout>
  )
}
