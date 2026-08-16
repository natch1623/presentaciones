import { At, Ghost, Halo, Eyebrow, dly } from './Stage'
import { ReqRow } from './S13a_ArchitectureA'

const reqs = [
  { el: 'Ángulos', req: 'Uniones pared-piso y pared-pared redondeadas (sanitarias)', reason: 'Eliminan esquinas donde se acumula suciedad' },
  { el: 'Piso', req: 'Continuo, antideslizante, conductivo/disipativo, sin juntas', reason: 'Evita acumulación de carga electrostática' },
  { el: 'Ventanas', req: 'No recomendadas; si existen, selladas y de doble vidrio', reason: 'Compromete la presión diferencial' },
  { el: 'Instalaciones', req: 'Preferentemente por brazos pendulares de techo', reason: 'Elimina cables en la zona de circulación (caída y contaminación)' },
]

export default function S13b_ArchitectureB() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Zona blanca" side="left" size={150} top={-2} opacity={0.024} />
      <Halo x={200} y={280} size={680} color="rgba(0,212,255,0.13)" />
      <Halo x={1260} y={660} size={640} color="rgba(109,40,217,0.16)" />

      <At l={100} t={100} anim="none">
        <Eyebrow d={0}>Requisitos arquitectónicos · continuación</Eyebrow>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 1340, top: 180, width: 620, height: 1,
            backgroundImage: 'linear-gradient(90deg, rgba(0,212,255,0.3), transparent)',
            transform: 'rotate(118deg)', transformOrigin: 'left center', ...dly(2),
          }}
        />
      </At>

      {reqs.map((r, i) => (
        <ReqRow key={r.el} r={r} i={i} indent={166 - i * 22} top={190} d={2 + i} />
      ))}
    </div>
  )
}
