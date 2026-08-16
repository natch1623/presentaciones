import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Badge } from './SlideLayout'
import OrbitaPasos from '../components/OrbitaPasos'

/**
 * Pasos 1 a 4 del método: los que ocurren antes de tocar nada y los
 * que dirigen la primera medición. La órbita al margen muestra los
 * siete completos, con estos cuatro encendidos.
 */
export default function S20_PasosUnoCuatro() {
  const PASOS = [
    {
      n: 1,
      t: 'Verificar el síntoma',
      d: 'Reproducir la falla y confirmar exactamente qué hace y qué no hace el equipo. Muchas «fallas» son errores de operación, configuración o accesorio.',
      q: '¿Es reproducible? ¿Bajo qué condiciones aparece?',
      nota: 'Se documenta el síntoma observado, no la interpretación.',
    },
    {
      n: 2,
      t: 'Recopilar información',
      d: 'Historial del equipo —fallas y preventivos previos—, condiciones de uso y, fundamental, el manual de servicio con sus diagramas de bloques y su tabla de códigos de error.',
      q: '¿Qué código muestra el propio equipo?',
      nota: 'Aquí se leen los códigos antes de medir.',
    },
    {
      n: 3,
      t: 'Formular hipótesis',
      d: 'A partir del síntoma y del modelo de bloques, plantear en qué bloque o bloques es probable la falla, ordenándolas por probabilidad y por facilidad de comprobación.',
      q: '¿Cuál es la más probable y la más barata de descartar?',
      nota: 'Es la lógica FMEA aplicada al banco.',
    },
    {
      n: 4,
      t: 'Probar / aislar',
      d: 'Comprobar las hipótesis con mediciones dirigidas, usando las técnicas del bloque 4. Cada medición debe confirmar o descartar un bloque.',
      q: '¿Qué descarta exactamente esta medición?',
      nota: 'No se mide «por medir».',
    },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bloque 3 · pasos 1 a 4</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Antes de intervenir:</span> <Hydro><span>observar, leer, suponer, medir</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'flex', gap: 26, flex: 1, minHeight: 0, alignItems: 'stretch' }}>
        <OrbitaPasos total={7} activos={[1, 2, 3, 4]} height={470} tone="violet" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, minWidth: 0 }}>
          {PASOS.map((p, i) => (
            <Glass
              key={p.n}
              tone="violet"
              ornament
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                padding: '16px 18px',
                animation: `veilRise 0.8s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.1}s both`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--lilac)', letterSpacing: '0.1em' }}>
                  <span>{`0${p.n}`}</span>
                </span>
                <span className="font-display" style={{ fontSize: 22, color: 'var(--moon)', lineHeight: 1.1 }}>
                  <span>{p.t}</span>
                </span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                <span>{p.d}</span>
              </p>

              <div style={{ flex: 1 }} />

              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--cyan)',
                  lineHeight: 1.5,
                  paddingLeft: 10,
                  borderLeft: '1.5px solid rgba(189,248,255,0.35)',
                }}
              >
                <span>{p.q}</span>
              </div>

              <div style={{ marginTop: 2 }}>
                <Badge tone="moon">{p.nota}</Badge>
              </div>
            </Glass>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--moon-faint)', lineHeight: 1.6, margin: '12px 0 0' }}>
        <span>
          Los cuatro primeros pasos no reparan nada: acotan. Es la parte del método que más se salta y la que más
          tiempo ahorra.{' '}
        </span>
        <Lunar>
          <span>Los tres restantes cierran el ciclo.</span>
        </Lunar>
      </p>
    </SlideLayout>
  )
}
