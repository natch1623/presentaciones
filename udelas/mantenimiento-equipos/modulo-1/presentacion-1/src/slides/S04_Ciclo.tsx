import { SlideLayout, SlideTag, SlideTitle, Frost, Panel, Callout } from './SlideLayout'

/**
 * Los cuatro tipos de intervención y la secuencia fija que sigue
 * cualquiera de ellas. El flujo se dibuja como galones encadenados
 * para que se lea como un recorrido y no como siete cajas.
 */
export default function S04_Ciclo() {
  const TIPOS = [
    {
      k: 'Preventivo',
      q: 'Calendario',
      d: 'Se hace aunque el equipo funcione bien. Limpieza, ajuste, reemplazo de consumibles.',
      tone: 'frost' as const,
    },
    {
      k: 'Correctivo',
      q: 'Ya falló',
      d: 'Diagnóstico y reparación. No se programa: se mide cuánto tiempo estuvo detenido.',
      tone: 'crimson' as const,
    },
    {
      k: 'Predictivo',
      q: 'Tendencia',
      d: 'Se vigila una variable —vibración, horas, deriva— y se interviene antes del fallo.',
      tone: 'rift' as const,
    },
    {
      k: 'Verificación',
      q: 'Desempeño',
      d: 'Se comprueba que el equipo entrega el valor que indica: rpm, °C, %CO₂, m/s, µL.',
      tone: 'mint' as const,
    },
  ]

  const PASOS = [
    { n: '01', t: 'Orden de trabajo', d: 'Marca, modelo, serie, código de inventario y motivo.' },
    { n: '02', t: 'Descontaminar', d: 'El equipo se entrega limpio a servicio. EPP puesto.' },
    { n: '03', t: 'Aislar', d: 'Corte de energía, presión y líquidos. Bloqueo y etiqueta.' },
    { n: '04', t: 'Estado inicial', d: 'Inspección visual y funcional: cómo llegó, con evidencia.' },
    { n: '05', t: 'Rutina', d: 'Limpieza, ajuste, lubricación, consumibles, empaques.' },
    { n: '06', t: 'Medir', d: 'Instrumento patrón contra la tolerancia del fabricante.' },
    { n: '07', t: 'Liberar', d: 'Prueba funcional completa, etiqueta y bitácora firmada.' },
  ]

  return (
    <SlideLayout>
      <SlideTag>Método de trabajo</SlideTag>
      <SlideTitle size="md">
        <span>Cuatro tipos de intervención, </span>
        <Frost><span>una sola secuencia</span></Frost>
      </SlideTitle>

      {/* ── Tipos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {TIPOS.map((t, i) => (
          <div
            key={t.k}
            className="stagger-item"
            style={{
              paddingLeft: 13,
              borderLeft: `2px solid var(--${t.tone === 'frost' ? 'frost' : t.tone === 'crimson' ? 'crimson' : t.tone === 'rift' ? 'rift' : 'mint'})`,
              animationDelay: `${0.06 + i * 0.07}s`,
            }}
          >
            <div className="font-display" style={{ fontSize: 21, color: 'var(--ice)', lineHeight: 1.1 }}>
              <span>{t.k}</span>
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ice-faint)',
                margin: '4px 0 6px',
              }}
            >
              <span>{t.q}</span>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--ice-dim)', lineHeight: 1.5, margin: 0 }}>
              <span>{t.d}</span>
            </p>
          </div>
        ))}
      </div>

      {/* ── Secuencia ── */}
      <Panel label="Secuencia de una intervención · se cumple completa o no se cumple" tone="rift">
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
          {PASOS.map((p, i) => (
            <div
              key={p.n}
              className="stagger-item"
              style={{
                flex: 1,
                minWidth: 0,
                position: 'relative',
                padding: '12px 16px 12px 24px',
                marginLeft: i === 0 ? 0 : -12,
                background:
                  i === PASOS.length - 1
                    ? 'linear-gradient(120deg, rgba(79,227,193,0.12), rgba(7,10,26,0.85))'
                    : 'linear-gradient(120deg, rgba(19,26,64,0.78), rgba(7,10,26,0.88))',
                // El galón entra en punta por la izquierda, así que sólo
                // llevan filo los tres lados que sí se ven.
                borderTop: '1px solid rgba(143,220,255,0.18)',
                borderRight: '1px solid rgba(143,220,255,0.18)',
                borderBottom: '1px solid rgba(143,220,255,0.18)',
                // Galón: entra en punta por la izquierda y sale en punta por la derecha.
                clipPath:
                  'polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%)',
                animationDelay: `${0.34 + i * 0.06}s`,
                zIndex: PASOS.length - i,
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: 10, color: 'var(--frost)', letterSpacing: '0.1em', marginBottom: 3 }}
              >
                <span>{p.n}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ice)', fontWeight: 500, lineHeight: 1.2 }}>
                <span>{p.t}</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--ice-faint)', lineHeight: 1.4, margin: '4px 0 0' }}>
                <span>{p.d}</span>
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
        <Callout kind="rift" title="Dónde se pierde el trabajo">
          Los pasos 04 y 06 son los que más se saltan y los únicos que permiten demostrar que la
          intervención sirvió. Sin estado inicial no hay comparación; sin medición no hay liberación.
        </Callout>
      </div>
    </SlideLayout>
  )
}
