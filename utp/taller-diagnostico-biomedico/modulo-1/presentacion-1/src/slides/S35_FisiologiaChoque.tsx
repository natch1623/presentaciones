import { SlideLayout, SlideTag, SlideTitle, Glass, Formula, Hydro, Lunar, Alert, Callout, type Tone } from './SlideLayout'

/**
 * Fisiología del choque eléctrico. La escalera de corrientes a 60 Hz
 * es el dato que fundamenta todos los límites del bloque: sin ella los
 * microamperios de la tabla normativa parecen arbitrarios.
 *
 * El color escala con el daño —hydro, ámbar, rosa de alerta—, así que
 * la gravedad se lee antes que el número.
 */
export default function S35_FisiologiaChoque() {
  const ESCALERA: { i: string; e: string; tono: Tone; grave?: boolean }[] = [
    { i: '~ 0,5 – 1 mA', e: 'Umbral de percepción (cosquilleo)', tono: 'hydro' },
    { i: '~ 5 mA', e: 'Máxima corriente «inofensiva» aceptada', tono: 'cyan' },
    { i: '~ 10 – 16 mA', e: 'Umbral de «no soltar»: la contracción muscular impide soltar el conductor', tono: 'ember' },
    { i: '~ 20 – 50 mA', e: 'Contracción, dolor, dificultad respiratoria', tono: 'ember' },
    { i: '~ 100 mA – 3 A', e: 'Fibrilación ventricular (macroshock a través del tórax)', tono: 'alert', grave: true },
    { i: '> 6 A', e: 'Contracción sostenida del miocardio, quemaduras', tono: 'alert', grave: true },
  ]

  const TONO_FG: Record<string, string> = {
    hydro: 'var(--hydro)',
    cyan: 'var(--cyan)',
    ember: 'var(--ember)',
    alert: 'var(--alert)',
  }

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 6 · 6.1</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>No daña la tensión:</span> <Hydro><span>daña la corriente</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 960 }}>
        <span>
          El daño lo determina la corriente que atraviesa el cuerpo, su camino, su frecuencia y su duración. A 60 Hz
          los efectos escalan aproximadamente así:
        </span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 26, flex: 1, minHeight: 0 }}>
        {/* ── La escalera de corrientes ── */}
        <div style={{ display: 'flex', gap: 16, minWidth: 0 }}>
          {/* La barra que escala con el daño */}
          <div
            aria-hidden
            style={{
              width: 3,
              borderRadius: 3,
              background: 'linear-gradient(180deg, var(--hydro), var(--cyan) 18%, var(--ember) 52%, var(--alert) 82%)',
              boxShadow: '0 0 14px rgba(255,143,168,0.25)',
              flexShrink: 0,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1, minWidth: 0 }}>
            {ESCALERA.map((n, i) => (
              <div
                key={n.i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '128px 1fr',
                  gap: 14,
                  alignItems: 'center',
                  padding: '9px 14px',
                  borderRadius: 8,
                  background: n.grave ? 'rgba(255,143,168,0.06)' : 'rgba(245,247,255,0.018)',
                  border: `1px solid ${n.grave ? 'rgba(255,143,168,0.22)' : 'rgba(184,231,255,0.10)'}`,
                  animation: `glideIn 0.72s cubic-bezier(0.22,1,0.36,1) ${0.12 + i * 0.08}s both`,
                }}
              >
                <span className="font-mono" style={{ fontSize: 13, color: TONO_FG[n.tono], letterSpacing: '0.02em' }}>
                  <span>{n.i}</span>
                </span>
                <span style={{ fontSize: 12.5, color: n.grave ? 'var(--moon)' : 'var(--text-2)', lineHeight: 1.45 }}>
                  <span>{n.e}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Por qué: la ley de Ohm y la piel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          <Glass tone="cyan" ornament style={{ padding: '8px 18px 14px' }}>
            <Formula tone="cyan" size={30} note={<span>La corriente que circula depende de la impedancia del cuerpo, dominada por la piel.</span>}>
              <span>I cuerpo = V / Z cuerpo</span>
            </Formula>
          </Glass>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Glass tone="hydro" style={{ padding: '13px 15px', textAlign: 'center' }}>
              <div className="font-display" style={{ fontSize: 26, color: 'var(--hydro)', lineHeight: 1 }}>
                <span>decenas de kΩ</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.4 }}>
                <span>piel seca</span>
              </div>
            </Glass>

            <Glass tone="alert" style={{ padding: '13px 15px', textAlign: 'center' }}>
              <div className="font-display" style={{ fontSize: 26, color: 'var(--alert)', lineHeight: 1 }}>
                <span>~ 1 kΩ o menos</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.4 }}>
                <span>piel húmeda o con gel de electrodos</span>
              </div>
            </Glass>
          </div>

          <Callout kind="alert" title="La coincidencia peligrosa">
            La sensibilidad del cuerpo es máxima cerca de <Lunar>50–60 Hz</Lunar> —justo la frecuencia de red— y
            depende además de la duración de la exposición respecto al ciclo cardíaco. <Alert>Mismo voltaje, diez
            veces más corriente</Alert> cuando la piel está húmeda.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
