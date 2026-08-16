import { At, Ghost, Halo, Eyebrow, RE, RED, WH, WD, dly } from './Stage'

/**
 * La advertencia. Un aviso que puede matar a un paciente no se
 * pone en un recuadro rojo pequeño al pie de una tabla: se le da
 * la lámina entera.
 */
export default function S16b_GasesWarning() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="⚠" side="right" size={520} top={170} opacity={0.03} color={RE} />
      <Halo x={260} y={330} size={920} color="rgba(239,68,68,0.18)" />
      <Halo x={1200} y={720} size={620} color="rgba(245,158,11,0.12)" />

      <At l={100} t={132} anim="none">
        <Eyebrow d={0} color={RE}>Punto crítico de seguridad</Eyebrow>
      </At>

      <At l={96} t={182} w={1170} anim="none">
        <p
          className="font-display wipe"
          style={{ fontSize: 54, lineHeight: 1.16, color: WH, margin: 0, fontWeight: 400, ...dly(1) }}
        >
          Los códigos de color <span style={{ color: RE, textShadow: `0 0 54px ${RE}55` }}>NO son universales</span>.
        </p>
      </At>

      <At l={-70} t={352} w={620} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${RED})`, boxShadow: `0 0 18px ${RED}88`, ...dly(3) }}
        />
      </At>

      <At l={96} t={394} w={1140} d={4}>
        <p style={{ fontSize: 23, color: WD, lineHeight: 1.62, margin: 0, fontWeight: 300 }}>
          En Panamá conviven equipos de ambos mercados. Nunca identifiques una línea por color: verifica
          etiqueta, conector DISS/NIST y prueba de pureza.
        </p>
      </At>

      <At l={96} t={572} w={1160} d={7}>
        <p style={{ fontSize: 27, color: WH, lineHeight: 1.5, margin: 0, fontWeight: 300 }}>
          La <strong style={{ color: RE, fontWeight: 600 }}>conexión cruzada de gases medicinales</strong> es una de
          las causas históricas de mortalidad prevenible en quirófano.
        </p>
      </At>
    </div>
  )
}
