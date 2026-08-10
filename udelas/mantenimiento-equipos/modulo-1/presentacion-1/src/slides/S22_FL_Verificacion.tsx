import { SlideLayout, SlideTag, SlideTitle, Rift, Step, Figure, Panel, Callout } from './SlideLayout'

/**
 * Cómo se mide una cabina. La cuadrícula y el barrido son
 * procedimientos con geometría propia: se explican con el dibujo,
 * porque describirlos en texto no alcanza para ejecutarlos.
 */
export default function S22_FL_Verificacion() {
  return (
    <SlideLayout>
      <SlideTag tone="mint">03 · Flujo laminar — verificación</SlideTag>
      <SlideTitle size="md">
        <span>Tres ensayos que </span>
        <Rift><span>sí demuestran que la cabina protege</span></Rift>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure tone="mint" caption="Cuadrícula de nueve puntos y patrón de barrido del filtro.">
            <CuadriculaMedicion />
          </Figure>

          <Callout kind="mint" title="Uniformidad, no sólo promedio">
            Un promedio correcto puede esconder una zona muerta. Ningún punto debe apartarse más de
            ±20 % de la media: ahí es donde se contaminan los cultivos.
          </Callout>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Panel label="01 · Velocidad de aire — anemómetro" tone="frost">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="a" title="Cabina en régimen">Al menos 15 min encendida, ventana en la altura de trabajo.</Step>
              <Step n="b" title="Cuadrícula de 9 puntos">A 10–15 cm por debajo del filtro, repartidos en tres filas y tres columnas.</Step>
              <Step n="c" title="Promediar y comparar">Media dentro de lo declarado y ningún punto fuera de ±20 %.</Step>
            </div>
          </Panel>

          <Panel label="02 · Patrón de flujo — humo" tone="rift">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="a" title="Recorrer el frente" tone="rift">Humo a lo largo de la abertura: debe entrar, no salir hacia el operador.</Step>
              <Step n="b" title="Zona de trabajo" tone="rift">El humo baja recto hasta la superficie, sin remolinos ni ascensos.</Step>
              <Step n="c" title="Grabar" tone="rift">Video corto: es la única evidencia objetiva de un ensayo visual.</Step>
            </div>
          </Panel>

          <Panel label="03 · Integridad del HEPA — aerosol y fotómetro" tone="crimson">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="a" title="Concentración aguas arriba" tone="crimson">Inyectar el aerosol y fijar el 100 % de referencia.</Step>
              <Step n="b" title="Barrido" tone="crimson">Sonda a 2–3 cm, en pasadas solapadas sobre todo el medio y todo el marco.</Step>
              <Step n="c" title="Criterio" tone="crimson">Penetración ≤ 0,01 %. Una fuga en el sello invalida el filtro completo.</Step>
            </div>
          </Panel>

          <Callout kind="amber" title="Alcance del técnico">
            La medición de velocidad, el humo y la lectura del manómetro las hace el biomédico del
            hospital. La certificación anual con aerosol y conteo de partículas la firma personal
            certificado: lo que corresponde es programarla y conservar el informe.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}

/* ── Cuadrícula de medición y barrido del filtro ── */
function CuadriculaMedicion() {
  const ICE = '#eaf6ff'
  const MINT = '#4fe3c1'
  const CRIMSON = '#ff4d6a'

  return (
    <svg viewBox="0 0 440 250" style={{ width: '100%', height: '100%' }}>
      {/* ── izquierda: cuadrícula de 9 puntos ── */}
      <g>
        <rect x="24" y="34" width="176" height="132" fill="#04050e" stroke={ICE} strokeOpacity="0.35" strokeWidth="1.3" />
        {[0, 1, 2].map(r =>
          [0, 1, 2].map(c => {
            const x = 24 + 29 + c * 59
            const y = 34 + 22 + r * 44
            return (
              <g key={`${r}-${c}`}>
                <circle cx={x} cy={y} r="8" fill="none" stroke={MINT} strokeWidth="1.2" />
                <circle cx={x} cy={y} r="2" fill={MINT} />
              </g>
            )
          }),
        )}
        <text x="112" y="24" textAnchor="middle" fill={MINT} fontSize="10" fontFamily="JetBrains Mono, monospace">
          9 puntos · 3 × 3
        </text>
        <text x="112" y="188" textAnchor="middle" fill={ICE} fillOpacity="0.5" fontSize="9" fontFamily="JetBrains Mono, monospace">
          plano de trabajo
        </text>
        {/* cota de altura */}
        <path d="M 210,34 L 210,60 M 206,38 L 210,32 L 214,38 M 206,56 L 210,62 L 214,56" stroke={MINT} strokeWidth="0.9" fill="none" />
        <text x="216" y="52" fill={MINT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          10–15 cm
        </text>
        <line x1="24" y1="34" x2="200" y2="34" stroke={MINT} strokeWidth="2" strokeOpacity="0.6" />
      </g>

      {/* ── derecha: barrido del filtro ── */}
      <g>
        <rect x="260" y="34" width="156" height="132" fill="#04050e" stroke={CRIMSON} strokeOpacity="0.5" strokeWidth="1.3" />
        {/* marco / sello */}
        <rect x="266" y="40" width="144" height="120" fill="none" stroke={CRIMSON} strokeWidth="2.2" strokeOpacity="0.75" />
        {/* recorrido en zigzag */}
        <path
          d="M 274,50 L 402,50 L 402,68 L 274,68 L 274,86 L 402,86 L 402,104 L 274,104 L 274,122 L 402,122 L 402,140 L 274,140 L 274,152 L 402,152"
          fill="none"
          stroke={CRIMSON}
          strokeWidth="1.1"
          strokeOpacity="0.85"
          strokeLinejoin="round"
        />
        <circle cx="274" cy="50" r="3" fill={CRIMSON} />
        <text x="338" y="24" textAnchor="middle" fill={CRIMSON} fontSize="10" fontFamily="JetBrains Mono, monospace">
          barrido solapado
        </text>
        <text x="338" y="188" textAnchor="middle" fill={ICE} fillOpacity="0.5" fontSize="9" fontFamily="JetBrains Mono, monospace">
          medio + marco completo
        </text>
      </g>

      {/* leyenda */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="9">
        <rect x="24" y="212" width="10" height="10" fill="none" stroke={MINT} strokeWidth="1.2" />
        <text x="42" y="221" fill={ICE} fillOpacity="0.6">
          anemómetro · m/s
        </text>
        <rect x="188" y="212" width="10" height="10" fill="none" stroke={CRIMSON} strokeWidth="1.2" />
        <text x="206" y="221" fill={ICE} fillOpacity="0.6">
          sonda de fotómetro · 2–3 cm del filtro
        </text>
      </g>
    </svg>
  )
}
