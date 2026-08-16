import S01_Portada from './S01_Portada'
import S02_Dominio from './S02_Dominio'
import S03_Estructura from './S03_Estructura'
import S04_Constelacion from './S04_Constelacion'
import S05_Clase1 from './S05_Clase1'

import S06_B1_Portada from './S06_B1_Portada'
import S07_TresConceptos from './S07_TresConceptos'
import S08_Banera from './S08_Banera'
import S09_Indicadores from './S09_Indicadores'
import S10_ModosFalla from './S10_ModosFalla'
import S11_FMEA from './S11_FMEA'

import S12_B2_Portada from './S12_B2_Portada'
import S13_Cadena from './S13_Cadena'
import S14_Alimentacion from './S14_Alimentacion'
import S15_Sensor from './S15_Sensor'
import S16_Acondicionamiento from './S16_Acondicionamiento'
import S17_Procesamiento from './S17_Procesamiento'
import S18_SalidaAlarmas from './S18_SalidaAlarmas'

import S19_B3_Portada from './S19_B3_Portada'
import S20_PasosUnoCuatro from './S20_PasosUnoCuatro'
import S21_PasosCincoSiete from './S21_PasosCincoSiete'

import S22_B4_Portada from './S22_B4_Portada'
import S23_HalfSplit from './S23_HalfSplit'
import S24_HalfSplitEjemplo from './S24_HalfSplitEjemplo'
import S25_OtrasTecnicas from './S25_OtrasTecnicas'
import S26_ComparacionTecnicas from './S26_ComparacionTecnicas'
import S27_ArbolDecision from './S27_ArbolDecision'
import S28_CodigosError from './S28_CodigosError'

import S29_B5_Portada from './S29_B5_Portada'
import S30_DmmOsciloscopio from './S30_DmmOsciloscopio'
import S31_AnalizadorFuente from './S31_AnalizadorFuente'
import S32_Simuladores from './S32_Simuladores'

import S33_Clase2 from './S33_Clase2'

import S34_B6_Portada from './S34_B6_Portada'
import S35_FisiologiaChoque from './S35_FisiologiaChoque'
import S36_MacroMicro from './S36_MacroMicro'
import S37_ClasesPartes from './S37_ClasesPartes'
import S38_TierraFugas from './S38_TierraFugas'
import S39_Limites from './S39_Limites'
import S40_SecuenciaSeguridad from './S40_SecuenciaSeguridad'

import S41_B7_Portada from './S41_B7_Portada'
import S42_Monitor from './S42_Monitor'
import S43_Bomba from './S43_Bomba'
import S44_Ventilador from './S44_Ventilador'
import S45_Fototerapia from './S45_Fototerapia'
import S46_Electrobisturi from './S46_Electrobisturi'
import S47_Desfibrilador from './S47_Desfibrilador'
import S48_Incubadora from './S48_Incubadora'
import S49_PatronTransversal from './S49_PatronTransversal'

import S50_B8_Portada from './S50_B8_Portada'
import S51_OrdenTrabajo from './S51_OrdenTrabajo'
import S52_HistorialIndicadores from './S52_HistorialIndicadores'
import S53_AptoParaUso from './S53_AptoParaUso'

import S54_Clase3 from './S54_Clase3'
import S55_Bibliografia from './S55_Bibliografia'
import S56_Conclusion from './S56_Conclusion'
import S57_Gracias from './S57_Gracias'

/**
 * Orden original del deck. El modo editor puede reordenarlo, ocultar
 * entradas o intercalar diapositivas nuevas sin tocar este archivo —
 * `title` es sólo el nombre con el que cada una aparece en el panel.
 *
 * El deck sigue el material teórico: apertura, Clase 1 (bloques 1–5),
 * Clase 2 (bloques 6–8) y cierre. Cada bloque abre con su portadilla
 * lunar; las siete familias del bloque 7 comparten plantilla, igual que
 * las cinco etapas de la cadena funcional del bloque 2.
 */
export const slides = [
  // ── Apertura ──
  { id: 'portada', title: 'Portada', component: S01_Portada },
  { id: 'dominio', title: 'Introducción · el dominio', component: S02_Dominio },
  { id: 'estructura', title: 'Estructura del taller', component: S03_Estructura },
  { id: 'constelacion', title: 'Mapa · los ocho bloques', component: S04_Constelacion },

  // ── Clase 1 ──
  { id: 'clase-1', title: 'Clase 1 · separador', component: S05_Clase1 },

  // ── Bloque 1 · Fundamentos ──
  { id: 'b1', title: 'Bloque 1 · portadilla', component: S06_B1_Portada },
  { id: 'b1-conceptos', title: 'Falla, error y avería', component: S07_TresConceptos },
  { id: 'b1-banera', title: 'Curva de la bañera', component: S08_Banera },
  { id: 'b1-indicadores', title: 'MTBF, MTTR y disponibilidad', component: S09_Indicadores },
  { id: 'b1-modos', title: 'Modos de falla', component: S10_ModosFalla },
  { id: 'b1-fmea', title: 'FMEA como marco mental', component: S11_FMEA },

  // ── Bloque 2 · Bloques funcionales ──
  { id: 'b2', title: 'Bloque 2 · portadilla', component: S12_B2_Portada },
  { id: 'b2-cadena', title: 'La cadena funcional', component: S13_Cadena },
  { id: 'b2-alimentacion', title: 'Etapa · alimentación', component: S14_Alimentacion },
  { id: 'b2-sensor', title: 'Etapa · sensor y señales', component: S15_Sensor },
  { id: 'b2-acond', title: 'Etapa · acondicionamiento', component: S16_Acondicionamiento },
  { id: 'b2-proc', title: 'Etapa · procesamiento', component: S17_Procesamiento },
  { id: 'b2-salida', title: 'Etapa · salida y alarmas', component: S18_SalidaAlarmas },

  // ── Bloque 3 · Metodología ──
  { id: 'b3', title: 'Bloque 3 · portadilla', component: S19_B3_Portada },
  { id: 'b3-pasos-1-4', title: 'Método · pasos 1 a 4', component: S20_PasosUnoCuatro },
  { id: 'b3-pasos-5-7', title: 'Método · pasos 5 a 7', component: S21_PasosCincoSiete },

  // ── Bloque 4 · Técnicas ──
  { id: 'b4', title: 'Bloque 4 · portadilla', component: S22_B4_Portada },
  { id: 'b4-halfsplit', title: 'División a la mitad', component: S23_HalfSplit },
  { id: 'b4-ejemplo', title: 'Half‑split · ejemplo ECG plano', component: S24_HalfSplitEjemplo },
  { id: 'b4-otras', title: 'Rastreo, sustitución, bracketing', component: S25_OtrasTecnicas },
  { id: 'b4-comparacion', title: 'Comparación de técnicas', component: S26_ComparacionTecnicas },
  { id: 'b4-arbol', title: 'Árbol de decisión', component: S27_ArbolDecision },
  { id: 'b4-codigos', title: 'Códigos de error', component: S28_CodigosError },

  // ── Bloque 5 · Instrumentos ──
  { id: 'b5', title: 'Bloque 5 · portadilla', component: S29_B5_Portada },
  { id: 'b5-dmm-osc', title: 'Multímetro y osciloscopio', component: S30_DmmOsciloscopio },
  { id: 'b5-analizador', title: 'Analizador y fuente variable', component: S31_AnalizadorFuente },
  { id: 'b5-simuladores', title: 'Simuladores de paciente', component: S32_Simuladores },

  // ── Clase 2 ──
  { id: 'clase-2', title: 'Clase 2 · separador', component: S33_Clase2 },

  // ── Bloque 6 · Seguridad eléctrica ──
  { id: 'b6', title: 'Bloque 6 · portadilla', component: S34_B6_Portada },
  { id: 'b6-fisiologia', title: 'Fisiología del choque', component: S35_FisiologiaChoque },
  { id: 'b6-macro-micro', title: 'Macroshock y microshock', component: S36_MacroMicro },
  { id: 'b6-clases', title: 'Clases y partes aplicadas', component: S37_ClasesPartes },
  { id: 'b6-tierra-fugas', title: 'Tierra y corrientes de fuga', component: S38_TierraFugas },
  { id: 'b6-limites', title: 'Valores límite IEC 60601‑1', component: S39_Limites },
  { id: 'b6-secuencia', title: 'Secuencia de seguridad', component: S40_SecuenciaSeguridad },

  // ── Bloque 7 · Familias de equipo ──
  { id: 'b7', title: 'Bloque 7 · portadilla', component: S41_B7_Portada },
  { id: 'b7-monitor', title: 'Monitor de signos vitales', component: S42_Monitor },
  { id: 'b7-bomba', title: 'Bomba de infusión', component: S43_Bomba },
  { id: 'b7-ventilador', title: 'Ventilador mecánico', component: S44_Ventilador },
  { id: 'b7-fototerapia', title: 'Lámpara de fototerapia', component: S45_Fototerapia },
  { id: 'b7-electrobisturi', title: 'Electrobisturí', component: S46_Electrobisturi },
  { id: 'b7-desfibrilador', title: 'Desfibrilador', component: S47_Desfibrilador },
  { id: 'b7-incubadora', title: 'Incubadora neonatal', component: S48_Incubadora },
  { id: 'b7-patron', title: 'Patrón transversal', component: S49_PatronTransversal },

  // ── Bloque 8 · Documentación ──
  { id: 'b8', title: 'Bloque 8 · portadilla', component: S50_B8_Portada },
  { id: 'b8-orden', title: 'La orden de trabajo', component: S51_OrdenTrabajo },
  { id: 'b8-historial', title: 'Historial e indicadores', component: S52_HistorialIndicadores },
  { id: 'b8-apto', title: 'Equipo apto para uso', component: S53_AptoParaUso },

  // ── Cierre ──
  { id: 'clase-3', title: 'Clase 3 · práctica y evaluación', component: S54_Clase3 },
  { id: 'bibliografia', title: 'Bibliografía', component: S55_Bibliografia },
  { id: 'conclusion', title: 'Conclusión', component: S56_Conclusion },
  { id: 'gracias', title: 'Gracias · preguntas', component: S57_Gracias },
]
