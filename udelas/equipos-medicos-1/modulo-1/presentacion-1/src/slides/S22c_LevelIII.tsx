import { LevelScene, type Level } from './S22_Levels'

const level: Level = {
  level: 'NIVEL III',
  sub: 'Alta especialización',
  color: '#00d4ff',
  numeral: 'III',
  location: 'Hospitales de referencia nacional y universitarios',
  anesthesia: 'General avanzada; BIS, hemodinámica invasiva, monitorización de profundidad',
  equipment: 'Cirugía robótica, neuronavegación, imagen intraoperatoria, CEC, quirófano híbrido',
  hvac: 'Aire ultralimpio / flujo unidireccional, control validado',
  procedures: 'Neurocirugía, cardiovascular, trasplantes, oncológica compleja, cirugía fetal',
  support: 'UCI + Banco de sangre 24/7 + Patología intraoperatoria',
  biomed: 'Ingeniería clínica especializada, validación, gestión de riesgo y ciclo de vida',
}

export default function S22c_LevelIII() {
  return <LevelScene l={level} />
}
