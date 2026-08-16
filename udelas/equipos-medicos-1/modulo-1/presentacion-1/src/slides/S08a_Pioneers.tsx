import { At, Ghost, Halo, Title, Ac, CY, VI, GO, RE, GRE, WD, WF, dly } from './Stage'

const pioneers = [
  {
    name: 'Ignaz Semmelweis', year: '1847', city: 'Viena',
    text: 'Mortalidad por fiebre puerperal 3× mayor en sala médica. Lavado de manos con hipoclorito: mortalidad cayó de ~18% a <2%.',
    before: '18%', after: '<2%', drop: true, stat: '',
    color: CY, glow: 'rgba(0,212,255,0.18)', l: 96, t: 262,
  },
  {
    name: 'Joseph Lister', year: '1867', city: 'Glasgow',
    text: 'Aplicó la teoría microbiana de Pasteur: pulverización de ácido carbólico. Publicado en The Lancet. Nace la antisepsia.',
    drop: false, stat: 'Antisepsia',
    color: VI, glow: 'rgba(167,139,250,0.16)', l: 556, t: 344,
  },
  {
    name: 'Ernst von Bergmann', year: '1886', city: 'Berlín',
    text: 'Esterilización por vapor a presión del instrumental y textiles. Nace la asepsia — el principio que gobierna el quirófano hasta hoy.',
    drop: false, stat: 'Asepsia',
    color: GO, glow: 'rgba(251,191,36,0.14)', l: 1016, t: 426,
  },
]

/**
 * Los tres que resolvieron la infección, en cascada descendente.
 * La palabra que cada uno le dio al oficio —antisepsia, asepsia—
 * va suelta bajo el nombre, sin píldora: es un titular, no una
 * etiqueta de base de datos.
 */
export default function S08a_Pioneers() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Asepsia" side="right" size={230} top={-10} opacity={0.026} />
      {pioneers.map(p => (
        <Halo key={p.name} x={p.l + 150} y={p.t + 140} size={600} color={p.glow} />
      ))}

      <At l={96} t={94} w={840} anim="none">
        <Title size={54} d={0}>
          La revolución de la <Ac>Asepsia</Ac>
        </Title>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 40, top: 286, width: 1500, height: 1,
            background: `linear-gradient(90deg, transparent, ${CY}44 22%, ${VI}44 55%, ${GO}44 82%, transparent)`,
            transform: 'rotate(12.5deg)', transformOrigin: 'left center', ...dly(3),
          }}
        />
      </At>

      {pioneers.map((p, i) => (
        <At key={p.name} l={p.l} t={p.t} w={330} d={2 + i * 2} anim="rise">
          <p className="font-mono" style={{ fontSize: 11, color: p.color, letterSpacing: '0.18em', margin: '0 0 10px' }}>
            {p.year} · {p.city.toUpperCase()}
          </p>
          <h3
            className="font-display"
            style={{ fontSize: 29, margin: '0 0 14px', color: '#f0f9ff', lineHeight: 1.12 }}
          >
            {p.name}
          </h3>

          {p.drop ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
              <span className="font-mono" style={{ fontSize: 26, color: RE, textDecoration: 'line-through' }}>
                {p.before}
              </span>
              <span style={{ fontSize: 15, color: WF }}>→</span>
              <span className="font-mono" style={{ fontSize: 26, color: GRE, fontWeight: 700, textShadow: `0 0 22px ${GRE}55` }}>
                {p.after}
              </span>
              <span className="font-mono" style={{ fontSize: 9.5, color: WF, letterSpacing: '0.14em' }}>MORTALIDAD</span>
            </div>
          ) : (
            <p
              className="font-display"
              style={{ fontSize: 24, color: p.color, margin: '0 0 16px', textShadow: `0 0 26px ${p.color}55`, fontStyle: 'italic' }}
            >
              {p.stat}
            </p>
          )}

          <div
            className="span-x"
            style={{ width: 110, height: 1, background: `linear-gradient(90deg, ${p.color}88, transparent)`, marginBottom: 14, ...dly(3 + i * 2) }}
          />
          <p style={{ fontSize: 14.5, color: WD, lineHeight: 1.68, margin: 0, fontWeight: 300 }}>
            {p.text}
          </p>
        </At>
      ))}
    </div>
  )
}
