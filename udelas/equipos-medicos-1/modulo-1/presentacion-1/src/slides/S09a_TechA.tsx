import { At, Ghost, Halo, Title, Ac, WD, dly } from './Stage'

export const areaColors: Record<string, string> = {
  'Energía quirúrgica': '#f59e0b',
  'Anestesia': '#00d4ff',
  'Iluminación': '#fbbf24',
  'Monitorización': '#38bdf8',
  'Cirugía cardíaca': '#ef4444',
  'HVAC': '#10b981',
  'Seguridad': '#a78bfa',
  'Mínimamente invasiva': '#06b6d4',
}

const milestones = [
  { year: '1926', item: 'Electrobisturí (Bovie & Cushing)', area: 'Energía quirúrgica' },
  { year: '1926–30', item: 'Máquinas de anestesia con circuito circular y absorbedor de CO₂ (Dräger)', area: 'Anestesia' },
  { year: '1930–40', item: 'Lámpara quirúrgica sin sombra con múltiples reflectores; iluminación fría', area: 'Iluminación' },
  { year: '1950s', item: 'ECG intraoperatorio, primeros ventiladores mecánicos', area: 'Monitorización' },
]

/**
 * Una fila del siglo XX: el año en el margen, el hito en cuerpo
 * grande y el área a la que pertenece marcada solo por su color.
 * Compartida por las dos mitades.
 */
export function MilestoneRow({
  m, i, indent, top = 210, gap = 132, d,
}: {
  m: { year: string; item: string; area: string }
  i: number; indent: number; top?: number; gap?: number; d: number
}) {
  const c = areaColors[m.area]
  return (
    <At l={indent} t={top + i * gap} w={1320 - indent} d={d} anim="drift">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
        <span
          className="font-mono"
          style={{ width: 108, textAlign: 'right', flexShrink: 0, fontSize: 13, color: c, letterSpacing: '0.05em' }}
        >
          {m.year}
        </span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 12px ${c}`, flexShrink: 0, transform: 'translateY(-3px)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 21, color: WD, lineHeight: 1.45, margin: '0 0 9px', fontWeight: 300, maxWidth: 940 }}>
            {m.item}
          </p>
          <p className="font-mono" style={{ fontSize: 9.5, color: c, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, opacity: 0.85 }}>
            {m.area}
          </p>
        </div>
      </div>
    </At>
  )
}

export default function S09a_TechA() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="XX" side="right" size={480} top={250} opacity={0.028} />
      <Halo x={1260} y={260} size={720} color="rgba(245,158,11,0.12)" />
      <Halo x={120} y={680} size={640} color="rgba(0,212,255,0.14)" />

      <At l={96} t={96} w={880} anim="none">
        <Title size={50} d={0}>
          El quirófano se vuelve <Ac>tecnológico</Ac> — S. XX
        </Title>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 214, top: 226, width: 560, height: 1,
            background: 'linear-gradient(180deg, rgba(245,158,11,0.5), rgba(56,189,248,0.4))',
            backgroundImage: 'linear-gradient(90deg, rgba(245,158,11,0.5), rgba(56,189,248,0.35), transparent)',
            transform: 'rotate(76deg)', transformOrigin: 'left center', ...dly(2),
          }}
        />
      </At>

      {milestones.map((m, i) => (
        <MilestoneRow key={m.year} m={m} i={i} indent={100 + i * 24} d={2 + i} />
      ))}
    </div>
  )
}
