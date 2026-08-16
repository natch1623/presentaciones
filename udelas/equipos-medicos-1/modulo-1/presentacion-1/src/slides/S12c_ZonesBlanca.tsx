import { At, Ghost, Halo, Hang, CY, WD, dly } from './Stage'

const blanca = [
  'Zona de máxima restricción del bloque quirúrgico',
  'Sala de operaciones y corredores de acceso directo',
  'Puertas corredizas cerradas en todo momento',
  'Acceso exclusivo: equipo quirúrgico + paciente',
  'Vestimenta estéril completa obligatoria',
]

/**
 * La zona blanca sola en la lámina, iluminada. Es el único sitio
 * del hospital con esta lista de condiciones, y darle una escena
 * propia es lo que hace que se recuerde como tal.
 */
export default function S12c_ZonesBlanca() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Blanca" side="right" size={250} top={-8} opacity={0.03} color={CY} />
      <Halo x={300} y={330} size={900} color="rgba(0,212,255,0.2)" />
      <Halo x={1220} y={700} size={640} color="rgba(37,99,235,0.18)" />

      <At l={100} t={128} d={0} anim="drift">
        <p
          className="font-mono"
          style={{ fontSize: 40, color: CY, letterSpacing: '0.22em', fontWeight: 700, margin: '0 0 10px', textShadow: `0 0 44px ${CY}66` }}
        >
          ZONA BLANCA
        </p>
        <p style={{ fontSize: 17, color: 'rgba(240,249,255,0.5)', margin: 0 }}>Restringida · Estéril</p>
      </At>

      <At l={-80} t={272} w={700} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${CY})`, boxShadow: `0 0 20px ${CY}88`, ...dly(2) }}
        />
      </At>

      <At l={100} t={318} w={960} d={3} anim="none">
        <Hang items={blanca} color={CY} d={3} marker="dot" size={22} w={1060} gap={22} lead={1.5} />
      </At>

      <At l={100} t={630} w={1060} d={9}>
        <p style={{ fontSize: 28, color: CY, margin: '0 0 12px', fontWeight: 500, textShadow: `0 0 36px ${CY}44` }}>
          Regla de oro: limpio y sucio <em>nunca</em> se cruzan.
        </p>
        <p style={{ fontSize: 16, color: WD, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>
          Cada apertura de puerta rompe la presión diferencial y arrastra partículas al interior.
        </p>
      </At>
    </div>
  )
}
