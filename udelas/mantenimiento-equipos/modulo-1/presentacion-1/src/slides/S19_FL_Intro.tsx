import EquipoIntro from './EquipoIntro'

export default function S19_FL_Intro() {
  return (
    <EquipoIntro
      numeral="03"
      nombre="Cámara de flujo laminar"
      riesgo="Filtro HEPA"
      tone="rift"
      bajada="Entrega aire filtrado en régimen unidireccional sobre la zona de trabajo. Es el único equipo del módulo cuyo desempeño no se ve: hay que medirlo. Un filtro colmatado o una fuga en el sello siguen dejando la cabina encendida, con luz y con ruido, mientras contamina todo lo que se trabaje adentro."
      tareas={[
        { t: 'Medir la velocidad', d: 'Anemómetro en cuadrícula sobre el plano de trabajo, promedio y uniformidad.' },
        { t: 'Ver el flujo', d: 'Prueba de humo para confirmar patrón unidireccional y ausencia de reflujo.' },
        { t: 'Cuidar el HEPA', d: 'Prefiltro, presión diferencial y prueba de integridad con aerosol.' },
        { t: 'Controlar el UV', d: 'Limpieza del tubo, horas de uso e intensidad medida.' },
        { t: 'Distinguirla', d: 'Saber si protege al producto, al operador o a ambos: cambia todo el protocolo.' },
      ]}
      figura={{
        file: 'flujo-laminar/cabina-general.jpg',
        hint: 'Cabina de flujo laminar del laboratorio, con la ventana y el plano de trabajo visibles.',
        caption: 'Verificar en la placa si es cabina de flujo laminar o de bioseguridad Clase II.',
      }}
    />
  )
}
