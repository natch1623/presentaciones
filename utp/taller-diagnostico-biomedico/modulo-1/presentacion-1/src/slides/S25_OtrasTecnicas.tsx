import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Bullet, Badge } from './SlideLayout'
import { Moon, WaveLine } from '../components/Celestial'

/**
 * Las otras tres técnicas: rastreo de señal, sustitución y bracketing.
 *
 * Van juntas porque ninguna sustituye a la división a la mitad —la
 * complementan— y porque el criterio para elegir entre ellas es lo que
 * la diapositiva siguiente sistematiza.
 */
export default function S25_OtrasTecnicas() {
  const TECNICAS = [
    {
      t: 'Rastreo de señal',
      en: 'signal tracing',
      tono: 'hydro' as const,
      fase: 'crescent' as const,
      d: 'Se sigue una señal conocida —real o inyectada— a través de las etapas, midiendo en cada una con osciloscopio o multímetro hasta encontrar el punto donde se pierde o distorsiona. Ese punto delimita el bloque fallado.',
      puntos: [
        <>Puede hacerse hacia adelante, de la entrada a la salida, o hacia atrás.</>,
        <>
          Más lento que la división a la mitad, pero muy <Lunar>visual y didáctico</Lunar>.
        </>,
        <>No exige conocer de antemano el valor esperado en un único punto medio.</>,
      ],
      badge: 'Con señal patrón disponible',
    },
    {
      t: 'Sustitución',
      en: 'known‑good',
      tono: 'violet' as const,
      fase: 'eclipse' as const,
      d: 'Reemplazar un módulo, tarjeta, sensor o accesorio sospechoso por uno que se sabe bueno. Si la falla desaparece, estaba en el elemento sustituido.',
      puntos: [
        <>Rápida y potente con equipos modulares.</>,
        <>Puede dañar el repuesto si la falla original persiste en otra etapa.</>,
        <>
          Se usa para <Lunar>confirmar una hipótesis ya acotada</Lunar>, no para «probar a ver».
        </>,
      ],
      badge: 'Requiere stock verificado',
    },
    {
      t: 'Bracketing',
      en: 'acotamiento',
      tono: 'cyan' as const,
      fase: 'full' as const,
      d: 'Se fijan dos límites —un punto donde la señal se sabe buena y otro donde se sabe mala— y se acercan con mediciones sucesivas hasta atrapar el bloque fallado entre ambos.',
      puntos: [
        <>Es la formalización de «la falla está entre este punto que funciona y ese que no».</>,
        <>Se combina de forma natural con la división a la mitad.</>,
        <>Simple e intuitiva; menos eficiente que el half‑split puro.</>,
      ],
      badge: 'Se conocen los extremos',
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 4 · 4.2 a 4.4</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Rastrear, sustituir,</span> <Hydro><span>acotar</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, flex: 1, minHeight: 0 }}>
        {TECNICAS.map((t, i) => (
          <Glass
            key={t.t}
            tone={t.tono}
            ornament
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '18px 20px 20px',
              animation: `veilRise 0.85s cubic-bezier(0.22,1,0.36,1) ${0.12 + i * 0.13}s both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Moon size={34} phase={t.fase} tone={t.tono} halo={false} />
              <div>
                <div className="font-display" style={{ fontSize: 23, color: 'var(--moon)', lineHeight: 1.1 }}>
                  <span>{t.t}</span>
                </div>
                <div className="font-mono" style={{ fontSize: 9, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                  <span>{t.en.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
              <span>{t.d}</span>
            </p>

            <div className="orbit-divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {t.puntos.map((p, j) => (
                <Bullet key={j} tone={t.tono}>
                  {p}
                </Bullet>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            <div>
              <Badge tone={t.tono}>{t.badge}</Badge>
            </div>
          </Glass>
        ))}
      </div>

      <div aria-hidden style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <WaveLine width={560} height={26} tone="hydro" opacity={0.22} />
      </div>
    </SlideLayout>
  )
}
