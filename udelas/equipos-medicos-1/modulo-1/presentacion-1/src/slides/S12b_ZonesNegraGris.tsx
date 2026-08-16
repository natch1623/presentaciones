import { At, Ghost, Halo, Eyebrow, Hang, CY, WF, dly } from './Stage'

const negra = [
  'Primera barrera de acceso a la unidad',
  'Acceso de médicos, enfermeras, técnicos y camilleros',
  'Comunicación con zona gris: trampa de botas y camillas',
  'Contiene: recepción, vestidores, sanitarios, oficinas',
]

const gris = [
  'Requiere uniforme quirúrgico + gorro + mascarilla',
  'Área de lavado quirúrgico (preparación del equipo)',
  'Central de Equipos y Esterilización (CEyE)',
  'Cuarto de anestesia · sala de recuperación (URPA)',
  '🔧 Principal área de trabajo del Ingeniero Biomédico',
]

/**
 * Las dos zonas de afuera. La gris entra medio escalón más abajo
 * que la negra para que las dos columnas no se lean como un par de
 * paneles gemelos, y el renglón del ingeniero biomédico —el único
 * que le habla directamente a la clase— va en cian.
 */
export default function S12b_ZonesNegraGris() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Negra" side="left" size={230} top={-6} opacity={0.024} />
      <Halo x={220} y={330} size={640} color="rgba(107,114,128,0.16)" />
      <Halo x={1120} y={560} size={720} color="rgba(100,116,139,0.18)" />

      <At l={100} t={92} anim="none">
        <Eyebrow d={0}>Zonificación · las dos zonas de acceso</Eyebrow>
      </At>

      {/* ZONA NEGRA */}
      <At l={100} t={172} w={460} d={1} anim="drift">
        <p
          className="font-mono"
          style={{ fontSize: 25, color: '#7c8496', letterSpacing: '0.2em', fontWeight: 700, margin: '0 0 6px' }}
        >
          ZONA NEGRA
        </p>
        <p style={{ fontSize: 14.5, color: WF, margin: '0 0 24px' }}>No Restringida</p>
        <div
          className="span-x"
          style={{ width: 330, height: 1, background: 'linear-gradient(90deg, rgba(124,132,150,0.7), transparent)', marginBottom: 26, ...dly(2) }}
        />
        <Hang items={negra} color="#7c8496" d={3} marker="tick" size={16.5} w={420} gap={17} />
      </At>

      {/* ZONA GRIS, medio escalón abajo */}
      <At l={820} t={296} w={480} d={5} anim="drift">
        <p
          className="font-mono"
          style={{ fontSize: 25, color: '#8fa2c0', letterSpacing: '0.2em', fontWeight: 700, margin: '0 0 6px' }}
        >
          ZONA GRIS
        </p>
        <p style={{ fontSize: 14.5, color: WF, margin: '0 0 24px' }}>Semirrestringida</p>
        <div
          className="span-x"
          style={{ width: 360, height: 1, background: 'linear-gradient(90deg, rgba(143,162,192,0.7), transparent)', marginBottom: 26, ...dly(6) }}
        />
        <Hang
          items={gris.map((g, i) =>
            i === 4
              ? <span key={g} style={{ color: CY, fontWeight: 500 }}>{g}</span>
              : g
          )}
          color="#8fa2c0"
          d={7}
          marker="tick"
          size={16.5}
          w={440}
          gap={17}
        />
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 60, top: 216, width: 1420, height: 1,
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(143,162,192,0.3) 45%, transparent)',
            transform: 'rotate(14deg)', transformOrigin: 'left center', ...dly(4),
          }}
        />
      </At>
    </div>
  )
}
