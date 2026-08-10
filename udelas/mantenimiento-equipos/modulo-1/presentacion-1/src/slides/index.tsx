import S01_Cover from './S01_Cover'
import S02_Mapa from './S02_Mapa'
import S03_Objetivos from './S03_Objetivos'
import S04_Ciclo from './S04_Ciclo'
import S05_Seguridad from './S05_Seguridad'
import S06_Herramientas from './S06_Herramientas'

import S07_CF_Intro from './S07_CF_Intro'
import S08_CF_Anatomia from './S08_CF_Anatomia'
import S09_CF_Rutina from './S09_CF_Rutina'
import S10_CF_Verificacion from './S10_CF_Verificacion'
import S11_CF_Fallas from './S11_CF_Fallas'
import S12_CF_Practica from './S12_CF_Practica'

import S13_MI_Intro from './S13_MI_Intro'
import S14_MI_Anatomia from './S14_MI_Anatomia'
import S15_MI_Rutina from './S15_MI_Rutina'
import S16_MI_Kohler from './S16_MI_Kohler'
import S17_MI_Fallas from './S17_MI_Fallas'
import S18_MI_Practica from './S18_MI_Practica'

/**
 * Orden original del deck. El modo editor puede reordenarlo, ocultar
 * entradas o intercalar diapositivas nuevas sin tocar este archivo —
 * `title` es solo el nombre con el que cada una aparece en el panel.
 */
export const slides = [
  // ── Apertura ──
  { id: 'cover', title: 'Portada', component: S01_Cover },
  { id: 'mapa', title: 'Mapa del módulo', component: S02_Mapa },
  { id: 'objetivos', title: 'Resultado esperado', component: S03_Objetivos },
  { id: 'ciclo', title: 'Tipos de intervención y secuencia', component: S04_Ciclo },
  { id: 'seguridad', title: 'Seguridad transversal', component: S05_Seguridad },
  { id: 'herramientas', title: 'Instrumentación del módulo', component: S06_Herramientas },

  // ── 01 · Centrífuga ──
  { id: 'cf-intro', title: 'Centrífuga · portadilla', component: S07_CF_Intro },
  { id: 'cf-anatomia', title: 'Centrífuga · anatomía', component: S08_CF_Anatomia },
  { id: 'cf-rutina', title: 'Centrífuga · rutina', component: S09_CF_Rutina },
  { id: 'cf-verif', title: 'Centrífuga · verificación', component: S10_CF_Verificacion },
  { id: 'cf-fallas', title: 'Centrífuga · diagnóstico', component: S11_CF_Fallas },
  { id: 'cf-practica', title: 'Centrífuga · práctica', component: S12_CF_Practica },

  // ── 02 · Microscopio ──
  { id: 'mi-intro', title: 'Microscopio · portadilla', component: S13_MI_Intro },
  { id: 'mi-anatomia', title: 'Microscopio · trayecto óptico', component: S14_MI_Anatomia },
  { id: 'mi-rutina', title: 'Microscopio · rutina', component: S15_MI_Rutina },
  { id: 'mi-kohler', title: 'Microscopio · alineación Köhler', component: S16_MI_Kohler },
  { id: 'mi-fallas', title: 'Microscopio · diagnóstico', component: S17_MI_Fallas },
  { id: 'mi-practica', title: 'Microscopio · práctica', component: S18_MI_Practica },
]
