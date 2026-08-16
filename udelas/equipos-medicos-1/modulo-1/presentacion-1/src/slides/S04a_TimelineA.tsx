import { useState } from 'react'
import { At, Ghost, Halo, Title, Ac, CY, WD, WF, WG, dly } from './Stage'

/**
 * Primera mitad de los nueve mil años. La cronología desciende en
 * escalera: cada hito entra un poco más adentro que el anterior,
 * de modo que el borde izquierdo del texto dibuja la diagonal y no
 * hace falta ninguna caja para separar una fila de la siguiente.
 */
const events = [
  { year: '~7000 a.C.', event: 'Trepanaciones craneales', impact: 'Primeros instrumentos quirúrgicos líticos', era: 'ancient' },
  { year: '~1600 a.C.', event: 'Papiro de Edwin Smith', impact: 'Primer texto quirúrgico sistemático', era: 'ancient' },
  { year: '1545', event: 'Ambroise Paré', impact: 'Ligadura vascular reemplaza cauterización', era: 'early' },
  { year: '1846', event: 'Éter — Morton, Boston', impact: '🔑 Nace la anestesia moderna', era: 'key' },
  { year: '1867', event: 'Antisepsia — Joseph Lister', impact: 'Fenol: caen tasas de mortalidad', era: 'key' },
  { year: '1886', event: 'Esterilización por vapor — von Bergmann', impact: 'De antisepsia a asepsia', era: 'key' },
  { year: '1890', event: 'Guantes de goma — Halsted', impact: 'Barrera personal-paciente', era: 'modern' },
]

export const eraStyle: Record<string, { dot: string; text: string; label: string }> = {
  ancient: { dot: 'rgba(240,249,255,0.34)', text: 'rgba(240,249,255,0.56)', label: 'Antigüedad' },
  early:   { dot: 'rgba(56,189,248,0.6)',   text: 'rgba(240,249,255,0.7)',  label: 'Pre-moderno' },
  key:     { dot: '#00d4ff',                text: '#f0f9ff',                label: 'Hito clave' },
  modern:  { dot: 'rgba(96,165,250,0.85)',  text: 'rgba(240,249,255,0.82)', label: 'Era moderna' },
  digital: { dot: 'rgba(0,212,255,0.88)',   text: 'rgba(240,249,255,0.88)', label: 'Era digital' },
  future:  { dot: '#00d4ff',                text: '#f0f9ff',                label: 'Presente / futuro' },
}

/** Una fila de la cronología. La comparten las dos mitades. */
export function EventRow({
  e, i, selected, onSelect, indent, top = 148, gap = 86,
}: {
  e: { year: string; event: string; impact: string; era: string }
  i: number
  selected: boolean
  onSelect: () => void
  indent: number
  top?: number
  gap?: number
}) {
  const s = eraStyle[e.era]
  const isKey = e.era === 'key' || e.era === 'future'
  return (
    <At l={indent} t={top + i * gap} w={1340 - indent} d={2 + i} anim="drift">
      <div
        onClick={onSelect}
        style={{
          display: 'flex', alignItems: 'baseline', gap: 22, cursor: 'pointer',
          transform: selected ? 'translateX(14px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: 'auto',
        }}
      >
        <span
          className="font-mono"
          style={{
            width: 118, textAlign: 'right', flexShrink: 0,
            fontSize: selected ? 14 : isKey ? 13 : 12,
            color: selected ? CY : s.dot,
            fontWeight: isKey || selected ? 700 : 500,
            letterSpacing: '0.04em',
            transition: 'all 0.25s ease',
          }}
        >
          {e.year}
        </span>

        <span
          style={{
            width: selected ? 15 : isKey ? 11 : 7,
            height: selected ? 15 : isKey ? 11 : 7,
            borderRadius: '50%', flexShrink: 0,
            background: selected ? CY : s.dot,
            boxShadow: selected
              ? `0 0 24px ${CY}, 0 0 6px #fff`
              : isKey ? `0 0 16px ${s.dot}` : 'none',
            transform: 'translateY(-2px)',
            transition: 'all 0.25s ease',
          }}
        />

        {/* El hito y su consecuencia comparten el espacio que sobra.
            Con `flexShrink: 0` en ambos, un título largo empujaba la
            fila entera fuera del escenario por la derecha. */}
        <span
          style={{
            fontSize: selected ? 25 : isKey ? 23 : 19,
            fontWeight: isKey || selected ? 500 : 300,
            color: selected ? '#fff' : s.text,
            lineHeight: 1.3, minWidth: 0,
            transition: 'all 0.25s ease',
          }}
        >
          {e.event}
        </span>

        <span
          style={{
            flex: 1, minWidth: 0,
            fontSize: 13.5,
            color: selected ? CY : WF,
            lineHeight: 1.5, fontWeight: 300,
          }}
        >
          {e.impact}
        </span>

        <span
          className="font-mono"
          style={{
            flexShrink: 0, width: 132, textAlign: 'right', fontSize: 9,
            color: WG, letterSpacing: '0.16em', textTransform: 'uppercase',
          }}
        >
          {s.label}
        </span>
      </div>
    </At>
  )
}

export default function S04a_TimelineA() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="1846" side="right" size={330} top={430} opacity={0.032} font="mono" />
      <Halo x={1260} y={200} size={720} color="rgba(37,99,235,0.18)" />
      <Halo x={100} y={720} size={560} color="rgba(0,212,255,0.12)" />

      <At l={96} t={66} w={880} anim="none">
        <Title size={44} d={0}>
          De la mesa de cocina al <Ac>quirófano híbrido</Ac>
        </Title>
      </At>

      <At l={100} t={122} d={1}>
        <span style={{ fontSize: 13, color: WF, fontWeight: 300 }}>
          9,000 años de evolución quirúrgica · 14 hitos · toca un hito para ver el detalle
        </span>
      </At>

      {/* La espina desciende con la escalera, cortada por el borde */}
      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 190, top: 168, width: 700, height: 1.5,
            background: `linear-gradient(90deg, ${CY}, rgba(56,189,248,0.6) 55%, rgba(109,40,217,0.7))`,
            boxShadow: `0 0 14px ${CY}55`,
            transform: 'rotate(41deg)', transformOrigin: 'left center', ...dly(2),
          }}
        />
      </At>

      {events.map((e, i) => (
        <EventRow
          key={e.year}
          e={e}
          i={i}
          indent={96 + i * 26}
          selected={selected === i}
          onSelect={() => setSelected(selected === i ? null : i)}
        />
      ))}
    </div>
  )
}
