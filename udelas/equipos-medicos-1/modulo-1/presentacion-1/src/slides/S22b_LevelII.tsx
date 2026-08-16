import { LevelScene, type Level } from './S22_Levels'

const level: Level = {
  level: 'NIVEL II',
  sub: 'Intermedio',
  color: '#38bdf8',
  numeral: 'II',
  location: 'Hospitales regionales y distritales',
  anesthesia: 'General y regional; máquina con monitorización básica-intermedia',
  equipment: 'Mesa multiposición, ESU con REM, torre de laparoscopía, arco en C',
  hvac: 'Presión positiva controlada, ≥20 ACH, monitoreo continuo',
  procedures: 'Apendicectomía, herniorrafia, colecistectomía, cesárea, ortopedia',
  support: 'URPA + UCI disponible',
  biomed: 'MP programado + calibraciones + gestión de repuestos',
}

export default function S22b_LevelII() {
  return <LevelScene l={level} />
}
