import { SlideLayout, SlideTag, Hydro, Lunar, Bullet, Callout } from './SlideLayout'
import { Moon, Ripples, Spark } from '../components/Celestial'

/**
 * Introducción — «entrar en el dominio».
 *
 * Estructura del §19: el texto a la izquierda, un círculo lunar grande
 * a la derecha con el símbolo del taller dentro. Es la diapositiva que
 * fija el propósito formativo antes de que empiece la materia.
 */
export default function S02_Dominio() {
  return (
    <SlideLayout style={{ justifyContent: 'center', padding: '26px 64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 54, alignItems: 'center' }}>
        <div>
          <SlideTag tone="violet">
            <span>Presentación del material</span>
          </SlideTag>

          <h2
            className="font-display title-reveal"
            style={{ fontSize: 46, lineHeight: 1.08, color: 'var(--moon)', margin: '0 0 18px', fontWeight: 400 }}
          >
            <span>Diagnosticar es razonar</span>
            <br />
            <Hydro>
              <span>sobre cómo falla un sistema</span>
            </Hydro>
          </h2>

          <div
            style={{
              width: 160,
              height: 1.5,
              marginBottom: 22,
              background: 'linear-gradient(90deg, var(--hydro), transparent)',
              boxShadow: '0 0 12px rgba(114,199,255,0.5)',
            }}
          />

          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, margin: '0 0 22px', maxWidth: 580 }}>
            <span>
              El taller no enseña a cambiar piezas: enseña un método. Cada apartado desarrolla el porqué físico y
              de ingeniería detrás del procedimiento, no sólo los pasos.
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <Bullet tone="hydro">
              Interiorizar un <Lunar>método sistemático</Lunar> de diagnóstico.
            </Bullet>
            <Bullet tone="hydro">Comprender la instrumentación de prueba y qué mide cada instrumento.</Bullet>
            <Bullet tone="hydro">
              Aplicar con rigor los criterios de seguridad eléctrica de <Hydro>IEC 60601‑1</Hydro>.
            </Bullet>
            <Bullet tone="hydro">Documentar la intervención con trazabilidad.</Bullet>
          </div>

          <Callout kind="violet" title="Bibliografía de base">
            Carr &amp; Brown (troubleshooting de equipo médico) · Cromwell y Webster (bloques funcionales, sensores
            y seguridad) · Floyd (método sistemático) · IEC 60601‑1 y NFPA 99 / AAMI.
          </Callout>
        </div>

        {/* ── El dominio: una luna dentro de sus ondas ── */}
        <div
          className="crystal-in"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 340 }}
        >
          <Ripples size={330} tone="hydro" count={4} style={{ position: 'absolute' }} />
          <Moon size={200} phase="ring" tone="violet" rings={1}>
            <div style={{ textAlign: 'center' }}>
              <Spark size={16} tone="cyan" style={{ margin: '0 auto 8px' }} />
              <div
                className="font-rune"
                style={{ fontSize: 15, letterSpacing: '0.24em', color: 'var(--moon)', textShadow: '0 0 24px rgba(184,231,255,0.7)' }}
              >
                <span>SÍNTOMA</span>
              </div>
              <div style={{ fontSize: 16, color: 'var(--hydro)', margin: '5px 0' }}>
                <span>↓</span>
              </div>
              <div
                className="font-rune"
                style={{ fontSize: 15, letterSpacing: '0.24em', color: 'var(--moon)', textShadow: '0 0 24px rgba(184,231,255,0.7)' }}
              >
                <span>ERROR</span>
              </div>
              <div style={{ fontSize: 16, color: 'var(--hydro)', margin: '5px 0' }}>
                <span>↓</span>
              </div>
              <div
                className="font-rune"
                style={{ fontSize: 15, letterSpacing: '0.24em', color: 'var(--lilac)', textShadow: '0 0 24px rgba(199,181,255,0.8)' }}
              >
                <span>CAUSA RAÍZ</span>
              </div>
            </div>
          </Moon>
        </div>
      </div>
    </SlideLayout>
  )
}
