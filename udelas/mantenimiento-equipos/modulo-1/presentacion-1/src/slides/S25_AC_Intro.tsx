import EquipoIntro from './EquipoIntro'

export default function S25_AC_Intro() {
  return (
    <EquipoIntro
      numeral="04"
      nombre="Esterilizador de vapor"
      riesgo="Presión"
      tone="crimson"
      bajada="Esteriliza con vapor saturado a presión. Es el único equipo del módulo que trabaja como recipiente a presión y el único cuyo resultado no se puede comprobar mirando: un ciclo que terminó sin errores puede haber dejado material sin esterilizar si quedó aire en la cámara."
      tareas={[
        { t: 'Leer el ciclo', d: 'Interpretar la curva de presión y temperatura para saber qué falló y cuándo.' },
        { t: 'Cuidar el empaque', d: 'Inspección, limpieza y reemplazo del sello de puerta.' },
        { t: 'Probar la seguridad', d: 'Válvula de alivio, enclavamiento de puerta y presostato.' },
        { t: 'Verificar con indicadores', d: 'Físicos, químicos y biológicos: para qué sirve cada uno.' },
        { t: 'Combatir el aire', d: 'Purga, trampa de vapor y prueba de fuga de vacío.' },
      ]}
      figura={{
        file: 'autoclave/autoclave-general.jpg',
        hint: 'Autoclave de laboratorio con el panel de control, el manómetro y la puerta a la vista.',
        caption: 'Antes de tocarlo: manómetro en cero y cámara fría. Sin excepciones.',
      }}
    />
  )
}
