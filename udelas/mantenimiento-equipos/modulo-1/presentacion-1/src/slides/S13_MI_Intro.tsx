import EquipoIntro from './EquipoIntro'

export default function S13_MI_Intro() {
  return (
    <EquipoIntro
      numeral="02"
      nombre="Microscopio"
      riesgo="Óptica"
      tone="frost"
      bajada="Casi nunca se avería: se ensucia y se desalinea. La mayoría de los reclamos —«se ve borroso», «hay manchas», «no ilumina parejo»— se resuelven con limpieza correcta de la óptica y una alineación de Köhler, sin abrir el equipo ni pedir repuestos."
      tareas={[
        { t: 'Limpiar sin rayar', d: 'Papel de lente y solvente adecuado, en el orden correcto de afuera hacia adentro.' },
        { t: 'Alinear Köhler', d: 'Centrar y ajustar el diafragma de campo y el de apertura.' },
        { t: 'Localizar la mancha', d: 'Saber si el sucio está en el ocular, el objetivo, el condensador o la muestra.' },
        { t: 'Ajustar la mecánica', d: 'Tope de enfoque, dureza del coaxial, deriva de la platina.' },
        { t: 'Conservar', d: 'Almacenamiento, funda, control de humedad y hongos en la óptica.' },
      ]}
      figura={{
        file: 'microscopio/microscopio-general.jpg',
        hint: 'Microscopio binocular de laboratorio, vista de tres cuartos con el condensador visible.',
        caption: 'Modelo de referencia: microscopio biológico binocular con iluminación Köhler.',
      }}
    />
  )
}
