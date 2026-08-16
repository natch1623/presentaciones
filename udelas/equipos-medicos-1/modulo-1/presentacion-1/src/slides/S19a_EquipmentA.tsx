import { At, Ghost, Halo, Title, Ac, WH, WD, WF, dly } from './Stage'

const equipment = [
  { system: 'Soporte anestésico', equipment: 'Máquina de anestesia + ventilador + vaporizadores + AGSS', function: 'Administrar mezcla y sostener ventilación', topic: 'Tema 2', color: '#00d4ff' },
  { system: 'Monitorización', equipment: 'Monitor multiparámetro (ECG, SpO₂, PANI/PAI, EtCO₂, T°, BIS, TOF)', function: 'Vigilancia continua del paciente', topic: '', color: '#38bdf8' },
  { system: 'Iluminación', equipment: 'Lámpara quirúrgica cielítica y satélite', function: 'Iluminar cavidad sin sombras ni calor', topic: 'Tema 3', color: '#fbbf24' },
  { system: 'Energía quirúrgica', equipment: 'ESU mono/bipolar, sellador de vasos, ultrasónico', function: 'Corte, coagulación y hemostasia', topic: 'Tema 4', color: '#f59e0b' },
]

/**
 * El inventario base. El nombre del sistema cuelga en el margen con
 * su color, el equipo corre en cuerpo grande y el tema al que
 * pertenece queda al final de la línea, sin píldora: es una
 * referencia cruzada, no una etiqueta que haya que destacar.
 */
export function EquipRow({
  eq, i, indent, top, gap = 122, d,
}: {
  eq: { system: string; equipment: string; function: string; topic: string; color: string }
  i: number; indent: number; top: number; gap?: number; d: number
}) {
  return (
    <At l={indent} t={top + i * gap} w={1320 - indent} d={d} anim="drift">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <span
          style={{
            width: 168, textAlign: 'right', flexShrink: 0, fontSize: 13.5,
            color: eq.color, fontWeight: 600, lineHeight: 1.4,
          }}
        >
          {eq.system}
        </span>
        <span
          style={{
            width: 3, alignSelf: 'stretch', flexShrink: 0, minHeight: 40,
            background: `linear-gradient(180deg, ${eq.color}, transparent)`,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 19.5, color: WH, lineHeight: 1.4, margin: '0 0 8px', fontWeight: 300 }}>
            {eq.equipment}
          </p>
          <p style={{ fontSize: 13.5, color: WF, lineHeight: 1.5, margin: 0 }}>{eq.function}</p>
        </div>
        {eq.topic && (
          <span
            className="font-mono"
            style={{ flexShrink: 0, fontSize: 10.5, color: eq.color, letterSpacing: '0.16em', textTransform: 'uppercase' }}
          >
            {eq.topic}
          </span>
        )}
      </div>
    </At>
  )
}

export default function S19a_EquipmentA() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Equipo" side="right" size={250} top={-8} opacity={0.026} />
      <Halo x={180} y={300} size={700} color="rgba(0,212,255,0.14)" />
      <Halo x={1260} y={680} size={660} color="rgba(245,158,11,0.12)" />

      <At l={96} t={92} w={900} anim="none">
        <Title size={46} d={0}>
          Equipamiento base del <Ac>salón de operaciones</Ac>
        </Title>
      </At>

      {equipment.map((eq, i) => (
        <EquipRow key={eq.system} eq={eq} i={i} indent={100 + i * 24} top={240} d={2 + i} />
      ))}
    </div>
  )
}
