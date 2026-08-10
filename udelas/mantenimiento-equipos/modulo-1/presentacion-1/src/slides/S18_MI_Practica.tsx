import { SlideLayout, SlideTag, SlideTitle, Frost, Step, Panel } from './SlideLayout'
import RegistroFicha from './RegistroFicha'

export default function S18_MI_Practica() {
  const PASOS = [
    ['Recepción', 'Datos del equipo y motivo. Reproducir la queja del usuario tal como la describió.'],
    ['Estado inicial', 'Foto del campo visual con 10× y con 40×, antes de tocar nada.'],
    ['Desmontar oculares', 'Guardarlos en sitio limpio; tapar los tubos para que no entre polvo.'],
    ['Soplar', 'Pera de aire en oculares, objetivos, condensador y platina.'],
    ['Limpiar óptica', 'Papel de lente en espiral. Objetivo de inmersión al final.'],
    ['Limpiar mecánica', 'Platina, carro X‑Y, guías. Retirar aceite viejo y engrasar.'],
    ['Revisar lámpara', 'Contactos, reóstato y estabilidad de la iluminación.'],
    ['Montar y colimar', 'Distancia interpupilar y ajuste dióptrico en cero.'],
    ['Köhler', 'Secuencia completa con 10× y verificación en 40×.'],
    ['Ajustar coaxial', 'Tensión del macrométrico y tope de seguridad de enfoque.'],
    ['Verificar', 'Campo parejo, sin manchas, enfoque estable. Comparar con la foto inicial.'],
    ['Liberar', 'Funda, sílica gel, etiqueta con fecha y bitácora firmada.'],
  ]

  return (
    <SlideLayout>
      <SlideTag>02 · Microscopio — práctica guiada</SlideTag>
      <SlideTitle size="md">
        <span>Doce pasos y </span>
        <Frost><span>una comparación antes‑después</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, flex: 1, minHeight: 0 }}>
        <Panel label="Secuencia de taller · aproximadamente 45 min" tone="frost" style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {PASOS.map(([t, d], i) => (
              <Step key={t} n={i + 1} title={t} tone={i >= 10 ? 'mint' : 'frost'}>
                {d}
              </Step>
            ))}
          </div>
        </Panel>

        <RegistroFicha
          equipo="Microscopio"
          nota="La evidencia es la foto del campo antes y después: es lo que convence al usuario que reclamó."
          campos={[
            ['Objetivos limpiados', '4×/10×/40×/100×'],
            ['Köhler ejecutado', 'sí / no'],
            ['Campo parejo en 10×', 'pasa / no pasa'],
            ['Campo parejo en 40×', 'pasa / no pasa'],
            ['Manchas residuales', 'sí / no'],
            ['Deriva de enfoque', 'sí / no'],
            ['Lámpara', 'horas / reemplazo'],
            ['Resistencia de tierra', 'Ω'],
          ]}
        />
      </div>
    </SlideLayout>
  )
}
