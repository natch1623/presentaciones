import EquipoIntro from './EquipoIntro'

export default function S07_CF_Intro() {
  return (
    <EquipoIntro
      numeral="01"
      nombre="Centrífuga"
      riesgo="Energía cinética"
      tone="frost"
      bajada="Separa componentes de una muestra por densidad usando fuerza centrífuga. Es el equipo más simple del laboratorio y el que más daño puede hacer: un rotor de 4 000 rpm almacena la energía suficiente para atravesar la carcasa si se lo permite una grieta."
      tareas={[
        { t: 'Verificar velocidad', d: 'Tacómetro óptico contra el valor nominal, tolerancia ±5 %.' },
        { t: 'Verificar tiempo', d: 'Cronómetro patrón contra un ciclo programado, tolerancia ±10 %.' },
        { t: 'Inspeccionar el rotor', d: 'Corrosión, fisuras, vida útil y par de apriete del asiento.' },
        { t: 'Probar el enclavamiento', d: 'Que no arranque abierta y que no abra en movimiento.' },
        { t: 'Corregir vibración', d: 'Balanceo de carga, amortiguadores y estado de rodamientos.' },
      ]}
      figura={{
        file: 'centrifuga/centrifuga-general.jpg',
        hint: 'Centrífuga de laboratorio con la tapa abierta y el rotor de ángulo fijo a la vista.',
        caption: 'Modelo de referencia del taller: centrífuga clínica de mesa, rotor de ángulo fijo.',
      }}
    />
  )
}
