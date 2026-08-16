import { At, Ghost, Halo, Title, Ac, CY, VID, WH, WF, dly } from './Stage'

const lifecycle = [
  { phase: '01', name: 'Planificación y adquisición', desc: 'Especificación técnica, evaluación de necesidades, análisis de costo total de propiedad, compatibilidad con infraestructura existente.' },
  { phase: '02', name: 'Instalación y aceptación', desc: 'Pruebas de aceptación, verificación vs. especificación, línea base de mediciones (IEC 62353), capacitación al usuario.' },
  { phase: '03', name: 'Operación', desc: 'Soporte al usuario, gestión de alarmas, respuesta a fallas intraoperatorias.' },
  { phase: '04', name: 'Mantenimiento', desc: 'Preventivo programado, correctivo, calibración y verificación de desempeño.' },
  { phase: '05', name: 'Seguridad y vigilancia', desc: 'Pruebas eléctricas periódicas, tecnovigilancia, reporte de eventos adversos y alertas ECRI.' },
  { phase: '06', name: 'Baja y reemplazo', desc: 'Evaluación de obsolescencia, disposición final, gestión de residuos de equipos médicos.' },
]

/**
 * El ciclo de vida. La espina baja por el margen y va del cian al
 * violeta: la fase 06 está literalmente en otro color que la 01, y
 * eso es todo lo que hace falta para que se lea como un recorrido
 * y no como seis elementos de una lista.
 */
export default function S23a_Lifecycle() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="06" side="right" size={460} top={280} opacity={0.026} font="mono" />
      <Halo x={200} y={260} size={680} color="rgba(0,212,255,0.14)" />
      <Halo x={1220} y={700} size={700} color="rgba(109,40,217,0.2)" />

      <At l={96} t={82} w={900} anim="none">
        <Title size={46} d={0}>
          Ciclo de vida del <Ac>equipamiento quirúrgico</Ac>
        </Title>
      </At>

      {/* La espina del ciclo */}
      <At l={168} t={188} w={2} h={468} z={1} anim="none">
        <div
          className="span-y"
          style={{
            width: 2, height: '100%',
            background: `linear-gradient(180deg, ${CY}, ${VID})`,
            boxShadow: `0 0 12px ${CY}55`, ...dly(1),
          }}
        />
      </At>

      {lifecycle.map((p, i) => (
        <At key={p.phase} l={100} t={182 + i * 94} w={1220} d={2 + i} anim="drift">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <span
              className="font-mono"
              style={{ width: 48, textAlign: 'right', flexShrink: 0, fontSize: 15, color: CY, opacity: 0.75, letterSpacing: '0.05em' }}
            >
              {p.phase}
            </span>
            <span
              style={{
                width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                background: CY, boxShadow: `0 0 12px ${CY}`, transform: 'translateY(-3px)',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 22, color: WH, margin: '0 0 8px', lineHeight: 1.3, fontWeight: 400 }}>
                {p.name}
              </p>
              <p style={{ fontSize: 14, color: WF, margin: 0, lineHeight: 1.55, maxWidth: 1020 }}>
                {p.desc}
              </p>
            </div>
          </div>
        </At>
      ))}
    </div>
  )
}
