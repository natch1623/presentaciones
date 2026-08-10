import { SlideLayout, SlideTag, SlideTitle, Crimson, Panel, Callout, Figure, Badge } from './SlideLayout'

/**
 * Verificación del esterilizador. Se organiza por tipo de indicador
 * porque cada uno responde una pregunta distinta y sólo uno responde
 * la que importa: si murieron las esporas.
 */
export default function S28_AC_Indicadores() {
  const NIVELES = [
    {
      k: 'Indicadores físicos',
      q: '¿La máquina hizo el ciclo?',
      tone: 'frost' as const,
      badge: 'Cada ciclo',
      items: [
        'Registro impreso o digital de temperatura, presión y tiempo.',
        'Es lo primero que se revisa ante una duda: muestra en qué fase se desvió.',
        'No dice nada sobre el interior de los paquetes.',
      ],
    },
    {
      k: 'Indicadores químicos',
      q: '¿El vapor llegó hasta ahí?',
      tone: 'amber' as const,
      badge: 'Cada paquete',
      items: [
        'Clase 1: cinta testigo externa. Sólo distingue procesado de no procesado.',
        'Clase 4 a 6: integradores dentro del paquete, responden a tiempo y temperatura.',
        'Bowie‑Dick: detecta aire residual y fugas en autoclaves de prevacío.',
      ],
    },
    {
      k: 'Indicadores biológicos',
      q: '¿Murió lo que tenía que morir?',
      tone: 'mint' as const,
      badge: 'Semanal',
      items: [
        'Esporas de Geobacillus stearothermophilus, incubadas después del ciclo.',
        'Es la única prueba directa de esterilización.',
        'En cada carga de material implantable, sin excepción.',
      ],
    },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="mint">04 · Esterilizador — verificación</SlideTag>
      <SlideTitle size="md">
        <span>Tres niveles de evidencia y </span>
        <Crimson><span>sólo uno prueba la esterilización</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          {NIVELES.map((n, i) => (
            <div
              key={n.k}
              className="stagger-item"
              style={{
                display: 'flex',
                gap: 18,
                paddingLeft: 15,
                paddingBottom: 14,
                borderLeft: `2px solid ${n.tone === 'frost' ? 'var(--frost)' : n.tone === 'amber' ? 'var(--amber)' : 'var(--mint)'}`,
                borderBottom: i < NIVELES.length - 1 ? '1px solid rgba(234,246,255,0.06)' : 'none',
                animationDelay: `${0.08 + i * 0.1}s`,
              }}
            >
              <div style={{ minWidth: 208 }}>
                <div className="font-display" style={{ fontSize: 22, color: 'var(--ice)', lineHeight: 1.1 }}>
                  <span>{n.k}</span>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color:
                      n.tone === 'frost' ? 'var(--frost)' : n.tone === 'amber' ? 'var(--amber)' : 'var(--mint)',
                    margin: '5px 0 8px',
                    fontStyle: 'italic',
                  }}
                >
                  <span>{n.q}</span>
                </div>
                <Badge tone={n.tone}>{n.badge}</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, paddingTop: 3 }}>
                {n.items.map((t, j) => (
                  <div key={j} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        flexShrink: 0,
                        marginTop: 5,
                        width: 6,
                        height: 6,
                        background:
                          n.tone === 'frost' ? 'var(--frost)' : n.tone === 'amber' ? 'var(--amber)' : 'var(--mint)',
                        clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                      }}
                    />
                    <p style={{ fontSize: 11.5, color: 'var(--ice-dim)', lineHeight: 1.5, margin: 0 }}>
                      <span>{t}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure
            tone="amber"
            height={158}
            file="autoclave/indicadores.jpg"
            hint="Cinta testigo virada, integrador clase 5 y ampolla de indicador biológico, juntos."
            caption="Los tres, uno al lado del otro: responden preguntas distintas."
          />

          <Panel label="Qué hacer si el biológico da positivo" tone="crimson">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                'Retirar del uso toda la carga y las anteriores desde el último resultado negativo.',
                'No liberar más material hasta identificar la causa.',
                'Revisar registro físico del ciclo, empaque, purga y carga del equipo.',
                'Repetir el ciclo con indicador biológico en cámara vacía.',
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span
                    className="font-mono"
                    style={{ fontSize: 9.5, color: 'var(--crimson)', minWidth: 15 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontSize: 11, color: 'var(--ice-dim)', lineHeight: 1.45, margin: 0 }}>
                    <span>{t}</span>
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Callout kind="amber" title="La cinta no esteriliza">
            El viraje de la cinta externa sólo indica que el paquete estuvo dentro. Un paquete con
            cinta virada y aire adentro sigue estando contaminado.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
