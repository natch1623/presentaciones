import { LevelScene, type Level } from './S22_Levels'

const level: Level = {
  level: 'NIVEL I',
  sub: 'Básico',
  color: '#64748b',
  numeral: 'I',
  location: 'Centros de salud, policlínicas, clínicas ambulatorias',
  anesthesia: 'Local / sedación; sin anestesia general',
  equipment: 'Mesa simple, lámpara, ESU básica, aspirador, autoclave',
  hvac: 'Ventilación filtrada, presión positiva',
  procedures: 'Sutura, drenaje de abscesos, exéresis superficiales, biopsias',
  support: 'Referencia inmediata',
  biomed: 'Mantenimiento preventivo básico, verificación eléctrica',
}

export default function S22a_LevelI() {
  return <LevelScene l={level} first />
}
