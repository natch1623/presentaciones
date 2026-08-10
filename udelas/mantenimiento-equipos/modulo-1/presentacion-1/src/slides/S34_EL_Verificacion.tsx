import { SlideLayout, SlideTag, SlideTitle, Rift, Step, Figure, Panel, Callout } from './SlideLayout'

/**
 * Verificación por gravimetría. Es el ensayo más accesible del módulo
 * —hace falta una balanza y una placa— y el único que detecta un canal
 * a medio tapar antes de que arruine una corrida completa.
 */
export default function S34_EL_Verificacion() {
  return (
    <SlideLayout>
      <SlideTag tone="mint">05 · Lavador de ELISA — verificación</SlideTag>
      <SlideTitle size="md">
        <span>Gravimetría: </span>
        <Rift><span>un miligramo es un microlitro</span></Rift>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Panel label="Volumen dispensado" tone="frost">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="1" title="Pesar la placa vacía">Placa seca y a temperatura ambiente. Anotar la tara.</Step>
              <Step n="2" title="Dispensar un ciclo">Volumen programado, sin aspiración posterior.</Step>
              <Step n="3" title="Pesar de nuevo">La diferencia en miligramos es el volumen total en microlitros.</Step>
              <Step n="4" title="Calcular por pozo">Dividir entre 96 y comparar contra el volumen programado.</Step>
              <Step n="5" title="Buscar el desigual" tone="amber">
                Repetir por columnas para aislar el canal que dispensa de menos.
              </Step>
            </div>
          </Panel>

          <Panel label="Volumen residual" tone="mint">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="1" title="Llenar y pesar" tone="mint">Con la placa llena del ciclo anterior.</Step>
              <Step n="2" title="Aspirar" tone="mint">Un solo ciclo de aspiración, sin volver a dispensar.</Step>
              <Step n="3" title="Pesar y dividir" tone="mint">
                Lo que queda entre 96 es el residual por pozo, en microlitros.
              </Step>
            </div>
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure tone="mint" caption="Mapa de placa: así se ve un canal obstruido en la columna 7.">
            <MapaPlaca />
          </Figure>

          <Callout kind="mint" title="El ensayo del colorante">
            Dispensar solución coloreada, lavar el ciclo completo y leer la placa en el lector: los
            pozos con lavado deficiente saltan a la vista sin necesidad de balanza. Sirve como
            control rápido entre verificaciones gravimétricas.
          </Callout>

          <Callout kind="amber" title="Lo que reclama el laboratorio">
            «El fondo está alto» y «los duplicados no coinciden» son quejas de lavado antes que de
            reactivo. Empezar por el residual y por la uniformidad entre canales.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}

/* ── Mapa de placa de 96 pozos con una columna deficiente ── */
function MapaPlaca() {
  const ICE = '#eaf6ff'
  const MINT = '#4fe3c1'
  const CRIMSON = '#ff4d6a'
  const AMBER = '#ffb44d'

  const filas = 8
  const cols = 12
  const r = 7.5
  const step = 20

  return (
    <svg viewBox="0 0 300 210" style={{ width: '100%', height: '100%' }}>
      <rect x="14" y="20" width="272" height="172" fill="#04050e" stroke={ICE} strokeOpacity="0.35" strokeWidth="1.3" rx="4" />

      {Array.from({ length: filas }, (_, f) =>
        Array.from({ length: cols }, (_, c) => {
          const cx = 32 + c * step + 8
          const cy = 36 + f * step + 4
          // La columna 7 aspira mal; la 8 apenas fuera de rango.
          const estado = c === 6 ? 'mal' : c === 7 ? 'limite' : 'ok'
          const color = estado === 'mal' ? CRIMSON : estado === 'limite' ? AMBER : MINT
          return (
            <circle
              key={`${f}-${c}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={color}
              fillOpacity={estado === 'mal' ? 0.55 : estado === 'limite' ? 0.32 : 0.14}
              stroke={color}
              strokeOpacity={estado === 'ok' ? 0.4 : 0.8}
              strokeWidth="1"
            />
          )
        }),
      )}

      {/* etiqueta de columna */}
      <text x={32 + 6 * step + 8} y="30" textAnchor="middle" fill={CRIMSON} fontSize="9" fontFamily="JetBrains Mono, monospace">
        7
      </text>

      {/* leyenda */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="8.5">
        <circle cx="26" cy="204" r="5" fill={MINT} fillOpacity="0.14" stroke={MINT} strokeWidth="1" />
        <text x="36" y="207" fill={ICE} fillOpacity="0.6">
          en rango
        </text>
        <circle cx="112" cy="204" r="5" fill={AMBER} fillOpacity="0.32" stroke={AMBER} strokeWidth="1" />
        <text x="122" y="207" fill={ICE} fillOpacity="0.6">
          al límite
        </text>
        <circle cx="192" cy="204" r="5" fill={CRIMSON} fillOpacity="0.55" stroke={CRIMSON} strokeWidth="1" />
        <text x="202" y="207" fill={ICE} fillOpacity="0.6">
          canal obstruido
        </text>
      </g>
    </svg>
  )
}
