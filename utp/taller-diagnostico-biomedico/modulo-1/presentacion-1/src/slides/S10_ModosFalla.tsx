import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Badge, Callout } from './SlideLayout'
import { Moon } from '../components/Celestial'

/**
 * Clasificación operativa de los modos de falla. Tres ejes —patrón
 * temporal, severidad y origen— que acotan las hipótesis antes de
 * perseguir nada.
 *
 * Va como tres dominios en paralelo en vez de una tabla de nueve
 * filas: cada eje es una pregunta distinta sobre la misma falla.
 */
type Categoria = { n: string; d: string; critica?: boolean }

export default function S10_ModosFalla() {
  const EJES: {
    eje: string
    pregunta: string
    tono: 'hydro' | 'violet' | 'cyan'
    fase: 'crescent' | 'eclipse' | 'full'
    cats: Categoria[]
  }[] = [
    {
      eje: 'Patrón temporal',
      pregunta: '¿Cuándo aparece?',
      tono: 'hydro' as const,
      fase: 'crescent' as const,
      cats: [
        {
          n: 'Permanente',
          d: 'Siempre presente. La más sencilla de localizar porque es reproducible en el banco.',
        },
        {
          n: 'Intermitente',
          d: 'Aparece y desaparece: conexiones frías, microfisuras, temperatura o vibración. Se busca provocándola —calor, golpeteo suave, flexión de cables—.',
        },
        {
          n: 'Transitoria',
          d: 'Ligada a una condición externa ya ausente (transitorio de red, EMI). Difícil de reproducir; se atiende con historial y contexto.',
        },
      ],
    },
    {
      eje: 'Severidad',
      pregunta: '¿Qué tan grave es?',
      tono: 'violet' as const,
      fase: 'eclipse' as const,
      cats: [
        { n: 'Catastrófica', d: 'El equipo no opera. Evidente: genera alarma o apagado.' },
        {
          n: 'Degradada',
          d: 'Opera fuera de tolerancia sin señal evidente. La MÁS peligrosa en clínica: mide o dosifica mal en silencio.',
          critica: true,
        },
      ],
    },
    {
      eje: 'Origen',
      pregunta: '¿De dónde viene?',
      tono: 'cyan' as const,
      fase: 'full' as const,
      cats: [
        { n: 'Diseño / fabricación', d: 'Recurrente en todo un lote o modelo. Revisar alertas y recalls del fabricante.' },
        { n: 'Desgaste', d: 'Envejecimiento, fatiga, deriva. Predecible; es el blanco del preventivo.' },
        { n: 'Uso / mantenimiento', d: 'Mal uso, accesorio incompatible, limpieza agresiva, PM omitido.' },
      ],
    },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bloque 1 · 1.3</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Modos de falla:</span> <Hydro><span>clasificar antes de perseguir</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, flex: 1, minHeight: 0 }}>
        {EJES.map((e, i) => (
          <Glass
            key={e.eje}
            tone={e.tono}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '18px 18px 20px',
              animation: `veilRise 0.85s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.13}s both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Moon size={32} phase={e.fase} tone={e.tono} halo={false} />
              <div>
                <div className="font-display" style={{ fontSize: 21, color: 'var(--moon)', lineHeight: 1.1 }}>
                  <span>{e.eje}</span>
                </div>
                <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', marginTop: 3 }}>
                  <span>{e.pregunta}</span>
                </div>
              </div>
            </div>

            <div className="orbit-divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {e.cats.map(c => (
                <div
                  key={c.n}
                  style={{
                    paddingLeft: 11,
                    borderLeft: `1.5px solid ${c.critica ? 'var(--alert)' : 'rgba(184,231,255,0.22)'}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: c.critica ? 'var(--alert)' : 'var(--moon)',
                      fontWeight: 500,
                      marginBottom: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>{c.n}</span>
                    {c.critica && <Badge tone="alert">crítica</Badge>}
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
                    <span>{c.d}</span>
                  </p>
                </div>
              ))}
            </div>
          </Glass>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Callout kind="alert" title="Prioridad clínica">
          La falla degradada exige que el diagnóstico biomédico NO termine cuando el equipo vuelve a encender, sino
          cuando se verifica que opera dentro de tolerancia y es seguro. Este es el rasgo que distingue el
          mantenimiento de equipo médico de la reparación electrónica común.
        </Callout>
      </div>
    </SlideLayout>
  )
}
