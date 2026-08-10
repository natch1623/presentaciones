import { SlideLayout, SlideTitle, CyanAccent, Divider } from './SlideLayout'

const pioneers = [
  {
    name: 'Ignaz Semmelweis', year: '1847', city: 'Viena',
    text: 'Mortalidad por fiebre puerperal 3× mayor en sala médica. Lavado de manos con hipoclorito: mortalidad cayó de ~18% a <2%.',
    before: '18%', after: '<2%', drop: true,
    color: '#00d4ff', accent: 'cyan' as const,
  },
  {
    name: 'Joseph Lister', year: '1867', city: 'Glasgow',
    text: 'Aplicó la teoría microbiana de Pasteur: pulverización de ácido carbólico. Publicado en The Lancet. Nace la antisepsia.',
    stat: 'Antisepsia', color: '#a78bfa', accent: 'violet' as const,
  },
  {
    name: 'Ernst von Bergmann', year: '1886', city: 'Berlín',
    text: 'Esterilización por vapor a presión del instrumental y textiles. Nace la asepsia — el principio que gobierna el quirófano hasta hoy.',
    stat: 'Asepsia', color: '#fbbf24', accent: 'gold' as const,
  },
]

const concepts = [
  { term: 'Antisepsia', def: 'Eliminación de microorganismos sobre tejido vivo', example: 'Clorhexidina en piel del paciente', color: '#38bdf8' },
  { term: 'Asepsia', def: 'Barreras que impiden la llegada del microorganismo', example: 'Ropa estéril, campos, presión positiva', color: '#00d4ff' },
  { term: 'Desinfección', def: 'Eliminación de microorganismos en superficies inertes', example: 'Limpieza terminal del salón', color: '#7dd3fc' },
  { term: 'Esterilización', def: 'Destrucción de toda forma de vida microbiana, incluidas esporas', example: 'Autoclave 121–134 °C', color: '#a78bfa' },
]

export default function S08_Asepsia() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        La revolución de la <CyanAccent>Asepsia</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'space-between' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {pioneers.map((p, i) => (
          <div
            key={p.name}
            className="card-hover"
            style={{
              background: `linear-gradient(135deg, rgba(10,26,74,0.8) 0%, rgba(6,15,46,0.95) 100%)`,
              border: `1px solid ${p.color}30`,
              borderTop: `2px solid ${p.color}`,
              borderRadius: 12,
              padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: 12,
              position: 'relative', overflow: 'hidden',
              animation: `fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.12}s both`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 30px ${p.color}08`,
            }}
          >
            {/* Subtle shimmer overlay */}
            <div
              style={{
                position: 'absolute', inset: 0, borderRadius: 12,
                background: `radial-gradient(ellipse at 50% 0%, ${p.color}08 0%, transparent 60%)`,
                pointerEvents: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', margin: 0 }}>{p.name}</p>
                <p className="font-mono" style={{ fontSize: 10, color: 'var(--white-faint)', margin: '3px 0 0' }}>
                  {p.year} · {p.city}
                </p>
              </div>
              {p.drop ? (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="font-mono" style={{ fontSize: 11, color: '#f87171', textDecoration: 'line-through' }}>{p.before}</span>
                    <span style={{ fontSize: 10, color: 'var(--white-faint)' }}>→</span>
                    <span className="font-mono" style={{ fontSize: 11, color: '#4ade80', fontWeight: 700 }}>{p.after}</span>
                  </div>
                  <p className="font-mono" style={{ fontSize: 9, color: 'var(--white-faint)', margin: '2px 0 0' }}>mortalidad</p>
                </div>
              ) : (
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 4,
                    background: `${p.color}14`, color: p.color,
                    border: `1px solid ${p.color}30`,
                  }}
                >
                  {(p as any).stat}
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'var(--white-dim)', margin: 0, lineHeight: 1.65 }}>{p.text}</p>
          </div>
        ))}
      </div>

      {/* Impact visualization */}
      <div
        style={{
          padding: '18px 26px',
          background: 'linear-gradient(90deg, rgba(0,212,255,0.05), rgba(10,26,74,0.6))',
          border: '1px solid rgba(0,212,255,0.15)',
          borderRadius: 12,
          animation: 'fadeSlideUp 0.5s ease 0.4s both',
        }}
      >
        <p className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', letterSpacing: '0.1em', margin: '0 0 14px' }}>
          IMPACTO MEDIBLE — MORTALIDAD POR FIEBRE PUERPERAL (SEMMELWEIS, 1847)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Sin lavado de manos', value: 18, display: '18%', color: '#f87171' },
            { label: 'Con antisepsia (hipoclorito)', value: 2, display: '<2%', color: '#4ade80' },
          ].map((b) => (
            <div key={b.label} style={{ display: 'grid', gridTemplateColumns: '190px 1fr 56px', gap: 14, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--white-dim)' }}>{b.label}</span>
              <div style={{ height: 10, background: 'rgba(240,249,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%', width: `${(b.value / 18) * 100}%`,
                    background: `linear-gradient(90deg, ${b.color}, ${b.color}cc)`,
                    borderRadius: 5,
                    boxShadow: `0 0 12px ${b.color}80`,
                  }}
                />
              </div>
              <span className="font-mono" style={{ fontSize: 13, color: b.color, fontWeight: 700, textAlign: 'right' }}>
                {b.display}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {concepts.map((c, i) => (
          <div
            key={c.term}
            className="card-hover"
            style={{
              padding: '14px 16px',
              background: 'rgba(10,26,74,0.6)',
              border: `1px solid ${c.color}20`,
              borderTop: `2px solid ${c.color}`,
              borderRadius: 9,
              animation: `scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.08}s both`,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: c.color, margin: '0 0 5px', textShadow: `0 0 12px ${c.color}50` }}>
              {c.term}
            </p>
            <p style={{ fontSize: 11, color: 'var(--white-dim)', margin: '0 0 5px', lineHeight: 1.55 }}>{c.def}</p>
            <p className="font-mono" style={{ fontSize: 10, color: 'var(--white-faint)', margin: 0 }}>Ej: {c.example}</p>
          </div>
        ))}
      </div>
      </div>
    </SlideLayout>
  )
}
