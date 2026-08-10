import EquipoIntro from './EquipoIntro'

export default function S31_EL_Intro() {
  return (
    <EquipoIntro
      numeral="05"
      nombre="Lavador de ELISA"
      riesgo="Obstrucción"
      tone="rift"
      bajada="Dispensa solución de lavado en los pozos de la microplaca y aspira el residual, tantas veces como pida el ensayo. Todo su mantenimiento gira alrededor de un solo problema: las sales del buffer cristalizan dentro de agujas de menos de un milímetro y tapan un canal sin que nadie lo note hasta que los resultados salen mal."
      tareas={[
        { t: 'Purgar', d: 'El enjuague con agua destilada al final de la jornada evita la mitad de las fallas.' },
        { t: 'Medir volumen', d: 'Gravimetría del volumen dispensado y del residual por pozo.' },
        { t: 'Destapar agujas', d: 'Identificar el canal obstruido y liberarlo sin doblar la aguja.' },
        { t: 'Alinear el cabezal', d: 'Centrado sobre los pozos y altura de la aguja aspiradora.' },
        { t: 'Mantener el vacío', d: 'Trampa, filtro hidrofóbico y sellos de la bomba.' },
      ]}
      figura={{
        file: 'elisa/lavador-general.jpg',
        hint: 'Lavador de microplacas con el cabezal de lavado y el carro portaplacas visibles.',
        caption: 'El cabezal de 8 o 12 canales es el corazón del equipo y el punto de falla.',
      }}
    />
  )
}
