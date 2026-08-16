import type { ReactNode } from 'react'
import { At, Ghost, Halo, Hang, Title, Ac, WF, dly } from './Stage'

const entrada = [
  'Identidad, sitio y procedimiento confirmados',
  'Consentimiento informado firmado',
  'Marcado del sitio quirúrgico',
  'Verificación del equipo de anestesia y medicación',
  'Pulsioxímetro funcionando',
  'Alergias, vía aérea difícil, riesgo de sangrado',
]

const pausa = [
  'Presentación nominal del equipo completo',
  'Confirmación en voz alta: paciente/sitio/procedimiento',
  'Eventos críticos previstos',
  'Profilaxis antibiótica en los últimos 60 min',
  'Imágenes esenciales desplegadas',
]

/**
 * Los dos primeros momentos de la lista. El numeral gigante de cada
 * momento va detrás del texto, casi invisible, en vez de dentro de
 * una tarjeta: la profundidad hace el trabajo que hacía el borde.
 */
export function Moment({
  id, sub, items, color, l, t, num, d,
}: {
  id: string; sub: string; items: ReactNode[]; color: string; l: number; t: number; num: string; d: number
}) {
  return (
    <>
      <div
        className="ghost-in select-none"
        style={{
          position: 'absolute', left: l - 26, top: t - 66,
          fontFamily: "'DM Serif Display', serif", fontSize: 220, lineHeight: 1,
          color, opacity: 0.07, zIndex: 0, pointerEvents: 'none', animationDelay: `${0.1 + d * 0.05}s`,
          ['--ghost-o' as string]: '0.07',
        }}
      >
        {num}
      </div>
      <At l={l} t={t} w={470} d={d} anim="drift" z={2}>
        <p
          className="font-mono"
          style={{ fontSize: 26, color, letterSpacing: '0.2em', fontWeight: 700, margin: '0 0 6px', textShadow: `0 0 26px ${color}66` }}
        >
          {id}
        </p>
        <p style={{ fontSize: 13.5, color: WF, margin: '0 0 22px' }}>{sub}</p>
        <div
          className="span-x"
          style={{ width: 320, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, marginBottom: 24, ...dly(d + 1) }}
        />
        <Hang items={items} color={color} d={d + 2} marker="tick" size={15.5} w={430} gap={15} />
      </At>
    </>
  )
}

export default function S21a_ChecklistA() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="OMS" side="right" size={280} top={-10} opacity={0.024} />
      <Halo x={220} y={420} size={720} color="rgba(34,197,94,0.13)" />
      <Halo x={1140} y={560} size={700} color="rgba(245,158,11,0.13)" />

      <At l={96} t={84} w={880} anim="none">
        <Title size={46} d={0}>
          Lista de Verificación <Ac>OMS</Ac>
        </Title>
      </At>

      <Moment
        id="ENTRADA"
        sub="Sign in — antes de la inducción anestésica"
        items={entrada}
        color="#22c55e"
        num="1"
        l={100}
        t={206}
        d={2}
      />

      <Moment
        id="PAUSA"
        sub="Time out — antes de la incisión"
        items={pausa}
        color="#f59e0b"
        num="2"
        l={820}
        t={318}
        d={6}
      />
    </div>
  )
}
