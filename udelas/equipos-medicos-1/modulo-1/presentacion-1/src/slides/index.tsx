import S01_Cover from './S01_Cover'
import S02a_Objectives from './S02a_Objectives'
import S02b_ObjectivesList from './S02b_ObjectivesList'
import S03a_Intro from './S03a_Intro'
import S03b_Consequence from './S03b_Consequence'
import S04a_TimelineA from './S04a_TimelineA'
import S04b_TimelineB from './S04b_TimelineB'
import S05a_Liston from './S05a_Liston'
import S05b_Origins from './S05b_Origins'
import S06a_PainA from './S06a_PainA'
import S06b_PainB from './S06b_PainB'
import S07a_EtherDay from './S07a_EtherDay'
import S07b_EtherFacts from './S07b_EtherFacts'
import S08a_Pioneers from './S08a_Pioneers'
import S08b_Impact from './S08b_Impact'
import S08c_Concepts from './S08c_Concepts'
import S09a_TechA from './S09a_TechA'
import S09b_TechB from './S09b_TechB'
import S10a_TodayA from './S10a_TodayA'
import S10b_TodayB from './S10b_TodayB'
import S11a_Definition from './S11a_Definition'
import S11b_Terms from './S11b_Terms'
import S12a_Zones from './S12a_Zones'
import S12b_ZonesNegraGris from './S12b_ZonesNegraGris'
import S12c_ZonesBlanca from './S12c_ZonesBlanca'
import S13a_ArchitectureA from './S13a_ArchitectureA'
import S13b_ArchitectureB from './S13b_ArchitectureB'
import S14a_HVAC from './S14a_HVAC'
import S14b_HVACWhy from './S14b_HVACWhy'
import S15a_Laminar from './S15a_Laminar'
import S15b_LaminarLesson from './S15b_LaminarLesson'
import S16a_Gases from './S16a_Gases'
import S16b_GasesWarning from './S16b_GasesWarning'
import S17a_ConnectorsA from './S17a_ConnectorsA'
import S17b_ConnectorsB from './S17b_ConnectorsB'
import S18a_Electrical from './S18a_Electrical'
import S18b_Shock from './S18b_Shock'
import S18c_FireTriangle from './S18c_FireTriangle'
import S19a_EquipmentA from './S19a_EquipmentA'
import S19b_EquipmentB from './S19b_EquipmentB'
import S20_Team from './S20_Team'
import S21a_ChecklistA from './S21a_ChecklistA'
import S21b_ChecklistB from './S21b_ChecklistB'
import S22a_LevelI from './S22a_LevelI'
import S22b_LevelII from './S22b_LevelII'
import S22c_LevelIII from './S22c_LevelIII'
import S23a_Lifecycle from './S23a_Lifecycle'
import S23b_Norms from './S23b_Norms'
import S24a_Close from './S24a_Close'
import S24b_NextTopic from './S24b_NextTopic'

/**
 * Orden original del deck. El modo editor puede reordenarlo, ocultar entradas o
 * intercalar diapositivas nuevas sin tocar este archivo — `title` es solo el
 * nombre con el que cada una aparece en el panel del editor.
 *
 * Cada entrada es *una escena*: una idea, una composición. Donde antes una
 * lámina apilaba tres bloques de contenido distintos, ahora hay dos o tres
 * láminas — el texto es el mismo, repartido para que cada golpe visual se lea
 * de una vez y desde la última fila del salón.
 */
export const slides = [
  { id: 'cover', title: 'Portada', component: S01_Cover },
  { id: 'objectives', title: 'Objetivos de aprendizaje · apertura', component: S02a_Objectives },
  { id: 'objectives-list', title: 'Los cinco objetivos', component: S02b_ObjectivesList },
  { id: 'intro', title: 'El ambiente más controlado del hospital', component: S03a_Intro },
  { id: 'consequence', title: 'Consecuencia para el ingeniero biomédico', component: S03b_Consequence },
  { id: 'timeline-a', title: 'Cronología I · de las trepanaciones a 1890', component: S04a_TimelineA },
  { id: 'timeline-b', title: 'Cronología II · de 1926 a hoy', component: S04b_TimelineB },
  { id: 'liston', title: 'Robert Liston: la velocidad como anestesia', component: S05a_Liston },
  { id: 'origins', title: 'Antes de 1846: las condiciones', component: S05b_Origins },
  { id: 'pain-a', title: 'Del opio al éter · los intentos', component: S06a_PainA },
  { id: 'pain-b', title: 'Del opio al éter · el hito de 1846', component: S06b_PainB },
  { id: 'etherday', title: 'El "Ether Day"', component: S07a_EtherDay },
  { id: 'ether-facts', title: 'Ether Day · el primer equipo de anestesia', component: S07b_EtherFacts },
  { id: 'pioneers', title: 'La revolución de la asepsia · los tres pioneros', component: S08a_Pioneers },
  { id: 'impact', title: 'Asepsia · el impacto medible', component: S08b_Impact },
  { id: 'concepts', title: 'Asepsia · terminología', component: S08c_Concepts },
  { id: 'tech-a', title: 'El quirófano tecnológico I · 1926–1950s', component: S09a_TechA },
  { id: 'tech-b', title: 'El quirófano tecnológico II · 1953–1987', component: S09b_TechB },
  { id: 'today-a', title: 'El quirófano hoy · híbrido y robótica', component: S10a_TodayA },
  { id: 'today-b', title: 'El quirófano hoy · integración, IA y modular', component: S10b_TodayB },
  { id: 'definition', title: 'Definición operativa', component: S11a_Definition },
  { id: 'terms', title: 'Términos que no son sinónimos', component: S11b_Terms },
  { id: 'zones', title: 'Zonificación quirúrgica · las tres zonas', component: S12a_Zones },
  { id: 'zones-negra-gris', title: 'Zona negra y zona gris', component: S12b_ZonesNegraGris },
  { id: 'zones-blanca', title: 'Zona blanca y regla de oro', component: S12c_ZonesBlanca },
  { id: 'architecture-a', title: 'Requisitos arquitectónicos I', component: S13a_ArchitectureA },
  { id: 'architecture-b', title: 'Requisitos arquitectónicos II', component: S13b_ArchitectureB },
  { id: 'hvac', title: 'Condiciones ambientales normadas (HVAC)', component: S14a_HVAC },
  { id: 'hvac-why', title: 'HVAC · por qué importa clínicamente', component: S14b_HVACWhy },
  { id: 'laminar', title: 'Mito vs. evidencia: el flujo laminar', component: S15a_Laminar },
  { id: 'laminar-lesson', title: 'Flujo laminar · la lección', component: S15b_LaminarLesson },
  { id: 'gases', title: 'Gases medicinales', component: S16a_Gases },
  { id: 'gases-warning', title: 'Gases · punto crítico de seguridad', component: S16b_GasesWarning },
  { id: 'connectors-a', title: 'Conectores · DISS y Chemetron', component: S17a_ConnectorsA },
  { id: 'connectors-b', title: 'Conectores · Ohmeda y rol del IB', component: S17b_ConnectorsB },
  { id: 'electrical', title: 'Seguridad eléctrica', component: S18a_Electrical },
  { id: 'shock', title: 'Macroshock y microshock', component: S18b_Shock },
  { id: 'fire', title: 'Triángulo de fuego quirúrgico', component: S18c_FireTriangle },
  { id: 'equipment-a', title: 'Equipamiento base I', component: S19a_EquipmentA },
  { id: 'equipment-b', title: 'Equipamiento base II', component: S19b_EquipmentB },
  { id: 'team', title: 'El equipo humano del quirófano', component: S20_Team },
  { id: 'checklist-a', title: 'Lista OMS · entrada y pausa', component: S21a_ChecklistA },
  { id: 'checklist-b', title: 'Lista OMS · salida y evidencia', component: S21b_ChecklistB },
  { id: 'level-1', title: 'Nivel I · básico', component: S22a_LevelI },
  { id: 'level-2', title: 'Nivel II · intermedio', component: S22b_LevelII },
  { id: 'level-3', title: 'Nivel III · alta especialización', component: S22c_LevelIII },
  { id: 'lifecycle', title: 'Ciclo de vida del equipamiento', component: S23a_Lifecycle },
  { id: 'norms', title: 'Normas de referencia esenciales', component: S23b_Norms },
  { id: 'close', title: 'Ideas para llevarse', component: S24a_Close },
  { id: 'next', title: 'Próximo tema: máquina de anestesia', component: S24b_NextTopic },
]
