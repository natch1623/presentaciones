import S01_Cover from './S01_Cover'
import S02_Objectives from './S02_Objectives'
import S03_Intro from './S03_Intro'
import S04_Timeline from './S04_Timeline'
import S05_Origins from './S05_Origins'
import S06_Pain from './S06_Pain'
import S07_EtherDay from './S07_EtherDay'
import S08_Asepsia from './S08_Asepsia'
import S09_TechOR from './S09_TechOR'
import S10_Today from './S10_Today'
import S11_Definition from './S11_Definition'
import S12_Zones from './S12_Zones'
import S13_Architecture from './S13_Architecture'
import S14_HVAC from './S14_HVAC'
import S15_Laminar from './S15_Laminar'
import S16_Gases from './S16_Gases'
import S16b_Connectors from './S16b_Connectors'
import S17_Electrical from './S17_Electrical'
import S18_Equipment from './S18_Equipment'
import S19_Team from './S19_Team'
import S20_Checklist from './S20_Checklist'
import S21_Levels from './S21_Levels'
import S22_BiomedRole from './S22_BiomedRole'
import S23_Close from './S23_Close'

/**
 * Orden original del deck. El modo editor puede reordenarlo, ocultar entradas o
 * intercalar diapositivas nuevas sin tocar este archivo — `title` es solo el
 * nombre con el que cada una aparece en el panel del editor.
 */
export const slides = [
  { id: 'cover', title: 'Portada', component: S01_Cover },
  { id: 'objectives', title: 'Objetivos de aprendizaje', component: S02_Objectives },
  { id: 'intro', title: 'El ambiente más controlado del hospital', component: S03_Intro },
  { id: 'timeline', title: 'De la mesa de cocina al quirófano híbrido', component: S04_Timeline },
  { id: 'origins', title: 'Antes de 1846: rapidez como única anestesia', component: S05_Origins },
  { id: 'pain', title: 'Del opio al éter', component: S06_Pain },
  { id: 'etherday', title: 'El "Ether Day"', component: S07_EtherDay },
  { id: 'asepsia', title: 'La revolución de la asepsia', component: S08_Asepsia },
  { id: 'tech', title: 'El quirófano se vuelve tecnológico (S. XX)', component: S09_TechOR },
  { id: 'today', title: 'El quirófano hoy: híbrido e integrado', component: S10_Today },
  { id: 'definition', title: 'Definición y terminología', component: S11_Definition },
  { id: 'zones', title: 'Zonificación quirúrgica: las tres zonas', component: S12_Zones },
  { id: 'architecture', title: 'Requisitos arquitectónicos de zona blanca', component: S13_Architecture },
  { id: 'hvac', title: 'Condiciones ambientales normadas (HVAC)', component: S14_HVAC },
  { id: 'laminar', title: 'Mito vs. evidencia: el flujo laminar', component: S15_Laminar },
  { id: 'gases', title: 'Gases medicinales', component: S16_Gases },
  { id: 'connectors', title: 'Conectores de gases', component: S16b_Connectors },
  { id: 'electrical', title: 'Seguridad eléctrica', component: S17_Electrical },
  { id: 'equipment', title: 'Equipamiento base', component: S18_Equipment },
  { id: 'team', title: 'El equipo humano del quirófano', component: S19_Team },
  { id: 'checklist', title: 'Lista de verificación OMS', component: S20_Checklist },
  { id: 'levels', title: 'Niveles de complejidad', component: S21_Levels },
  { id: 'biomed', title: 'Ciclo de vida del equipamiento', component: S22_BiomedRole },
  { id: 'close', title: 'Cierre e ideas para llevar', component: S23_Close },
]
