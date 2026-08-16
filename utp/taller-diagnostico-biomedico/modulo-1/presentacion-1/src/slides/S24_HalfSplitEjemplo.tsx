import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Callout } from './SlideLayout'
import { Spark } from '../components/Celestial'

/**
 * El ejemplo desarrollado: un monitor muestra ECG plano.
 *
 * Vale la pena una diapositiva entera porque es donde la técnica deja
 * de ser abstracta: se ve la cadena real, el punto donde se mide y las
 * dos mitades que quedan según la lectura.
 */
export default function S24_HalfSplitEjemplo() {
  const ETAPAS = ['Electrodo', 'Cable', 'Amplificador de entrada', 'Filtro', 'ADC', 'Procesamiento', 'Display']
  const MEDIO = 2 // el amplificador de entrada: el punto medio de la cadena

  const W = 1120
  const x0 = 70
  const paso = (W - x0 * 2) / (ETAPAS.length - 1)
  const cy = 96

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 4 · 4.1 · ejemplo desarrollado</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Un monitor muestra</span> <Hydro><span>ECG plano</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 4px', maxWidth: 980 }}>
        <span>
          Se inyecta una señal patrón con el simulador de ECG y se mide en el amplificador de entrada, el punto medio
          de una cadena de siete etapas. Con una sola medición el problema queda reducido a la mitad.
        </span>
      </p>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <svg viewBox={`0 0 ${W} 260`} style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="ejGlow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="ejFlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8d82e8" />
              <stop offset="100%" stopColor="#bdf8ff" />
            </linearGradient>
          </defs>

          <line x1={x0} y1={cy} x2={x0 + paso * 6} y2={cy} stroke="url(#ejFlow)" strokeWidth="1.2" strokeOpacity="0.45" />

          {ETAPAS.map((e, i) => {
            const cx = x0 + paso * i
            const esMedio = i === MEDIO
            const col = esMedio ? '#bdf8ff' : '#72c7ff'
            return (
              <g
                key={e}
                style={{
                  animation: `constellationPop 0.7s cubic-bezier(0.22,1,0.36,1) ${0.16 + i * 0.09}s both`,
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              >
                {esMedio && <circle cx={cx} cy={cy} r="38" fill="rgba(189,248,255,0.08)" stroke="rgba(189,248,255,0.26)" strokeWidth="0.8" />}
                <circle
                  cx={cx}
                  cy={cy}
                  r="22"
                  fill="rgba(8,13,36,0.9)"
                  stroke={col}
                  strokeOpacity={esMedio ? 0.95 : 0.45}
                  strokeWidth={esMedio ? 1.5 : 1}
                  filter={esMedio ? 'url(#ejGlow)' : undefined}
                />
                <text
                  x={cx}
                  y={cy + 4.5}
                  textAnchor="middle"
                  fill={col}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
                >
                  {i + 1}
                </text>

                <text
                  x={cx}
                  y={cy - 38}
                  textAnchor="middle"
                  fill={esMedio ? '#f5f7ff' : '#aab8d6'}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: esMedio ? 12.5 : 11.5, fontWeight: esMedio ? 500 : 400 }}
                >
                  {e}
                </text>
              </g>
            )
          })}

          {/* Marca del punto de medición */}
          <text
            x={x0 + paso * MEDIO}
            y={cy - 58}
            textAnchor="middle"
            fill="#bdf8ff"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em' }}
          >
            SE MIDE AQUÍ
          </text>

          {/* Mitad aguas arriba */}
          <path
            d={`M ${x0 - 8} ${cy + 46} L ${x0 - 8} ${cy + 62} L ${x0 + paso * MEDIO} ${cy + 62} L ${x0 + paso * MEDIO} ${cy + 46}`}
            fill="none"
            stroke="rgba(255,143,168,0.55)"
            strokeWidth="1"
          />
          <text
            x={(x0 - 8 + x0 + paso * MEDIO) / 2}
            y={cy + 82}
            textAnchor="middle"
            fill="#ff8fa8"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
          >
            señal incorrecta → la falla está aquí (2 etapas)
          </text>

          {/* Mitad aguas abajo */}
          <path
            d={`M ${x0 + paso * MEDIO} ${cy + 46} L ${x0 + paso * MEDIO} ${cy + 62} L ${x0 + paso * 6 + 8} ${cy + 62} L ${x0 + paso * 6 + 8} ${cy + 46}`}
            fill="none"
            stroke="rgba(189,248,255,0.55)"
            strokeWidth="1"
          />
          <text
            x={(x0 + paso * MEDIO + x0 + paso * 6 + 8) / 2}
            y={cy + 82}
            textAnchor="middle"
            fill="#bdf8ff"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 12 }}
          >
            señal correcta → la falla está aquí (4 etapas)
          </text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Glass tone="cyan" ornament style={{ padding: '15px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Spark size={11} tone="cyan" />
            <span className="font-mono" style={{ fontSize: 9.5, letterSpacing: '0.15em', color: 'var(--cyan)', textTransform: 'uppercase' }}>
              <span>La entrada conocida</span>
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
            <span>
              El simulador de ECG entrega una onda de amplitud y frecuencia conocidas. Sin esa referencia no hay
              punto medio que valga: no se sabría si lo medido es correcto.
            </span>
          </p>
        </Glass>

        <Callout kind="violet" title="Qué hace falta para aplicarla">
          Acceso físico al punto medio y <Lunar>conocer el valor esperado</Lunar> en ese punto —del manual de
          servicio—. Sin cualquiera de las dos, la técnica que corresponde es el rastreo de señal.
        </Callout>
      </div>
    </SlideLayout>
  )
}
