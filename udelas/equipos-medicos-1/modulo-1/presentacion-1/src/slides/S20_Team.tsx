import { At, Ghost, Halo, Title, Ac, CY, CYM, WH, WD, WF, dly } from './Stage'

const team = [
  { role: 'Cirujano principal', icon: '🔪', function: 'Ejecuta el procedimiento', biomed: 'Reporta fallas de ESU, óptica, mesa', color: '#38bdf8' },
  { role: 'Primer y segundo ayudante', icon: '🤝', function: 'Exposición y asistencia', biomed: '—', color: '#64748b' },
  { role: 'Anestesiólogo', icon: '💨', function: 'Anestesia, vía aérea y estabilidad hemodinámica', biomed: 'Usuario crítico de la máquina de anestesia y monitores', color: '#a78bfa' },
  { role: 'Enfermera instrumentista', icon: '🩺', function: 'Maneja instrumental estéril; conteo de gasas y material', biomed: 'Manejo de instrumental y cables', color: '#06b6d4' },
  { role: 'Enfermera circulante', icon: '🔄', function: 'Enlace entre campo estéril y exterior; documenta', biomed: 'Primer contacto ante falla de equipo', color: '#f59e0b' },
  { role: 'Técnico perfusionista', icon: '❤️', function: 'Opera la bomba de CEC', biomed: 'Coordina calibraciones y mantenimiento', color: '#ef4444' },
  { role: 'Técnico / Ingeniero biomédico', icon: '⚙️', function: 'Disponibilidad, seguridad y desempeño del equipamiento', biomed: '← Ustedes', color: '#00d4ff' },
]

/**
 * El equipo humano. La última fila —la de ellos— es la única que
 * crece y se ilumina: en la versión anterior llevaba un fondo con
 * borde para destacarse, que es exactamente el recurso que este
 * deck ya no usa. Aquí destaca por cuerpo y por luz.
 */
export default function S20_Team() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Equipo" side="right" size={240} top={-8} opacity={0.024} />
      <Halo x={200} y={260} size={680} color="rgba(56,189,248,0.13)" />
      <Halo x={1120} y={700} size={780} color="rgba(0,212,255,0.18)" />

      <At l={96} t={86} w={880} anim="none">
        <Title size={46} d={0}>
          El equipo humano del <Ac>quirófano</Ac>
        </Title>
      </At>

      {team.map((m, i) => {
        const mine = i === team.length - 1
        return (
          <At key={m.role} l={100} t={196 + i * 76} w={1240} d={2 + i} anim="drift">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ fontSize: mine ? 24 : 19, width: 34, flexShrink: 0 }}>{m.icon}</span>
              <span
                style={{
                  width: 268, flexShrink: 0,
                  fontSize: mine ? 21 : 17,
                  color: mine ? CY : WH,
                  fontWeight: mine ? 600 : 400,
                  lineHeight: 1.35,
                  textShadow: mine ? `0 0 30px ${CY}55` : 'none',
                }}
              >
                {m.role}
              </span>
              <span style={{ width: 430, flexShrink: 0, fontSize: 14, color: WD, lineHeight: 1.5, fontWeight: 300 }}>
                {m.function}
              </span>
              <span
                style={{
                  flex: 1, fontSize: mine ? 17 : 13.5, lineHeight: 1.5,
                  color: m.biomed === '—' ? 'rgba(240,249,255,0.2)' : mine ? CY : CYM,
                  fontWeight: mine ? 600 : 400,
                }}
              >
                {m.biomed}
              </span>
            </div>
            <div
              className="span-x"
              style={{
                width: 1220, height: 1, marginTop: 18,
                background: mine
                  ? `linear-gradient(90deg, ${CY}88, ${CY}22, transparent)`
                  : 'linear-gradient(90deg, rgba(240,249,255,0.09), transparent)',
                ...dly(3 + i),
              }}
            />
          </At>
        )
      })}
    </div>
  )
}
