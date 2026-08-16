import { At, Ghost, Halo, Eyebrow, dly } from './Stage'
import { EquipRow } from './S19a_EquipmentA'

const equipment = [
  { system: 'Posicionamiento', equipment: 'Mesa quirúrgica, accesorios, colchón térmico', function: 'Exponer el campo y proteger al paciente', topic: 'Tema 5', color: '#a78bfa' },
  { system: 'Visualización', equipment: 'Torre de laparoscopía: cámara, fuente de luz, insuflador, monitor', function: 'Cirugía mínimamente invasiva', topic: 'Tema 6', color: '#6d28d9' },
  { system: 'Soporte circulatorio', equipment: 'Bomba de CEC, oxigenador, intercambiador de calor', function: 'Sustituir corazón y pulmón', topic: 'Tema 7', color: '#ef4444' },
  { system: 'Complementarios', equipment: 'Bombas de infusión, desfibrilador, calentador de fluidos, aspirador, arco en C', function: 'Soporte perioperatorio', topic: '', color: '#64748b' },
]

export default function S19b_EquipmentB() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="07" side="left" size={440} top={280} opacity={0.026} font="mono" />
      <Halo x={240} y={280} size={700} color="rgba(167,139,250,0.16)" />
      <Halo x={1240} y={660} size={640} color="rgba(239,68,68,0.12)" />

      <At l={100} t={104} anim="none">
        <Eyebrow d={0}>Equipamiento base · continuación</Eyebrow>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 1320, top: 186, width: 600, height: 1,
            backgroundImage: 'linear-gradient(90deg, rgba(167,139,250,0.35), transparent)',
            transform: 'rotate(116deg)', transformOrigin: 'left center', ...dly(2),
          }}
        />
      </At>

      {equipment.map((eq, i) => (
        <EquipRow key={eq.system} eq={eq} i={i} indent={172 - i * 24} top={196} d={2 + i} />
      ))}
    </div>
  )
}
