import EquipoIntro from './EquipoIntro'

export default function S37_CO_Intro() {
  return (
    <EquipoIntro
      numeral="06"
      nombre="Incubadora de CO₂"
      riesgo="Contaminación"
      tone="mint"
      bajada="Sostiene tres variables a la vez —37 °C, 5 % de CO₂ y humedad cercana a la saturación— porque el cultivo celular depende de las tres. El CO₂ no está para calentar ni para llenar: mantiene el pH del medio a través del sistema bicarbonato. Si se desvía, el medio vira y el cultivo se pierde sin ninguna alarma de por medio."
      tareas={[
        { t: 'Calibrar el CO₂', d: 'Analizador independiente por el puerto de muestreo, con tiempo de estabilización.' },
        { t: 'Verificar temperatura', d: 'Termómetro patrón en el centro de la cámara y en varias posiciones.' },
        { t: 'Descontaminar', d: 'Ciclo completo, bandeja de agua, filtros y empaque.' },
        { t: 'Buscar fugas', d: 'El consumo excesivo de CO₂ casi siempre es el empaque de la puerta.' },
        { t: 'Distinguir el sensor', d: 'Conductividad térmica o infrarrojo: cambia cuándo y cómo se recalibra.' },
      ]}
      figura={{
        file: 'incubadora/incubadora-general.jpg',
        hint: 'Incubadora de CO₂ con la puerta exterior abierta y la puerta interior de vidrio a la vista.',
        caption: 'Anotar de la placa el tipo de sensor de CO₂ y el tipo de camisa térmica.',
      }}
    />
  )
}
