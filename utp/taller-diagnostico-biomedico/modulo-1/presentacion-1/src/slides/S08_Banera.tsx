import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro } from './SlideLayout'
import { Spark } from '../components/Celestial'

/**
 * La curva de la bañera: λ(t) no es constante a lo largo de la vida
 * del equipo. Gráfico al estilo del §23 —fondo azul oscuro, línea de
 * azul hielo, puntos cian, resaltados violetas y rejilla apenas
 * perceptible—: nada de colores aleatorios ni fondos blancos.
 */
export default function S08_Banera() {
  const REGIONES = [
    {
      t: 'Mortalidad infantil',
      sub: 'λ decreciente',
      tono: 'violet' as const,
      d: 'Fallas tempranas por defectos de fabricación o montaje.',
      accion: 'Se controlan con pruebas de rodaje (burn‑in) antes de poner el equipo en servicio clínico.',
    },
    {
      t: 'Vida útil',
      sub: 'λ ≈ constante',
      tono: 'hydro' as const,
      d: 'Fallas aleatorias, independientes del tiempo transcurrido.',
      accion: 'Es la región de operación normal y sobre ella se define la mayoría de indicadores de confiabilidad.',
    },
    {
      t: 'Desgaste',
      sub: 'λ creciente',
      tono: 'ember' as const,
      d: 'Fatiga mecánica, envejecimiento de LED y tubos, deriva de sensores, degradación de baterías y capacitores.',
      accion: 'Anticiparla es el objetivo del preventivo y del reemplazo programado de partes de vida limitada.',
    },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bloque 1 · 1.2</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Confiabilidad y</span> <Hydro><span>la curva de la bañera</span></Hydro>
      </SlideTitle>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 0 10px',
        }}
      >
        <svg viewBox="0 0 840 300" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="bnLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c7b5ff" />
              <stop offset="40%" stopColor="#b8e7ff" />
              <stop offset="72%" stopColor="#72c7ff" />
              <stop offset="100%" stopColor="#f3c98b" />
            </linearGradient>
            <linearGradient id="bnFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#72c7ff" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#72c7ff" stopOpacity="0" />
            </linearGradient>
            <filter id="bnGlow" x="-40%" y="-60%" width="180%" height="260%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Rejilla extremadamente tenue */}
          {[60, 105, 150, 195, 240].map(y => (
            <line key={y} x1="64" y1={y} x2="800" y2={y} stroke="rgba(184,231,255,0.05)" strokeWidth="0.6" />
          ))}

          {/* Bandas de región */}
          <rect x="64" y="34" width="196" height="212" fill="rgba(199,181,255,0.045)" />
          <rect x="260" y="34" width="320" height="212" fill="rgba(114,199,255,0.035)" />
          <rect x="580" y="34" width="220" height="212" fill="rgba(243,201,139,0.045)" />
          {[260, 580].map(x => (
            <line key={x} x1={x} y1="34" x2={x} y2="246" stroke="rgba(245,247,255,0.14)" strokeWidth="0.7" strokeDasharray="3 6" />
          ))}

          {/* Ejes */}
          <line x1="64" y1="246" x2="800" y2="246" stroke="rgba(184,231,255,0.28)" strokeWidth="1" />
          <line x1="64" y1="30" x2="64" y2="246" stroke="rgba(184,231,255,0.28)" strokeWidth="1" />

          {/* Área bajo la curva */}
          <path
            d="M 64 56 C 140 200, 200 224, 260 228 L 580 228 C 650 230, 720 160, 800 46 L 800 246 L 64 246 Z"
            fill="url(#bnFill)"
          />

          {/* λ(t) */}
          <path
            d="M 64 56 C 140 200, 200 224, 260 228 L 580 228 C 650 230, 720 160, 800 46"
            fill="none"
            stroke="url(#bnLine)"
            strokeWidth="2"
            filter="url(#bnGlow)"
            style={{ strokeDasharray: 1400, animation: 'constellationDraw 1.6s cubic-bezier(0.22,1,0.36,1) 0.3s both' }}
          />

          {/* Puntos cian en los quiebres */}
          {[
            [260, 228],
            [580, 228],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4" fill="#bdf8ff" filter="url(#bnGlow)" />
          ))}

          {/* Rótulos de eje */}
          <text x="72" y="24" fill="#aab8d6" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            λ(t) — tasa de fallas
          </text>
          <text x="800" y="268" textAnchor="end" fill="#aab8d6" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            tiempo en servicio
          </text>

          {/* Rótulos de región */}
          <text x="162" y="270" textAnchor="middle" fill="#c7b5ff" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em' }}>
            MORTALIDAD INFANTIL
          </text>
          <text x="420" y="270" textAnchor="middle" fill="#72c7ff" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em' }}>
            VIDA ÚTIL
          </text>
          <text x="690" y="270" textAnchor="middle" fill="#f3c98b" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em' }}>
            DESGASTE
          </text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {REGIONES.map((r, i) => (
          <Glass
            key={r.t}
            tone={r.tono}
            open
            style={{
              padding: '12px 16px',
              animation: `veilRise 0.8s cubic-bezier(0.22,1,0.36,1) ${0.5 + i * 0.12}s both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Spark size={9} tone={r.tono} />
              <span className="font-display" style={{ fontSize: 19, color: 'var(--moon)' }}>
                <span>{r.t}</span>
              </span>
              <span className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', marginLeft: 'auto' }}>
                <span>{r.sub}</span>
              </span>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, margin: '0 0 5px' }}>
              <span>{r.d}</span>
            </p>
            <p style={{ fontSize: 11, color: 'var(--moon-faint)', lineHeight: 1.5, margin: 0 }}>
              <span>{r.accion}</span>
            </p>
          </Glass>
        ))}
      </div>
    </SlideLayout>
  )
}
