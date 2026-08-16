import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Alert, Callout } from './SlideLayout'
import OrbitaPasos from '../components/OrbitaPasos'
import { Moon } from '../components/Celestial'

/**
 * La secuencia de seguridad antes de intervenir. Cinco pasos que
 * preceden a cualquier medición del bloque 4: el orden importa, porque
 * cada uno protege al que hace el siguiente.
 */
export default function S40_SecuenciaSeguridad() {
  const PASOS = [
    {
      t: 'Desconectar y descargar',
      d: 'Desenergizar. En equipos con almacenamiento de energía —desfibrilador— verificar y descargar los capacitores antes de tocar.',
      peligro: true,
    },
    {
      t: 'Inspección visual',
      d: 'Cable de red, enchufe, envolvente, olor o marcas de sobrecalentamiento, daño mecánico.',
    },
    {
      t: 'Continuidad de tierra',
      d: 'En equipo Clase I, antes de energizar para pruebas.',
    },
    {
      t: 'Medición de corrientes de fuga',
      d: 'En condición normal y en condición de primer defecto.',
    },
    {
      t: 'Comparar con límites y decidir',
      d: 'Sólo si cumple, el equipo se declara eléctricamente seguro para operar.',
      cierre: true,
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 6 · 6.7</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Secuencia de seguridad</span> <Hydro><span>antes de intervenir</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'flex', gap: 28, flex: 1, minHeight: 0 }}>
        <OrbitaPasos total={5} activos={[1, 2, 3, 4, 5]} height={430} tone="hydro" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 0 }}>
          {PASOS.map((p, i) => (
            <Glass
              key={p.t}
              tone={p.peligro ? 'alert' : p.cierre ? 'verdant' : 'hydro'}
              open
              style={{
                padding: '13px 18px',
                animation: `glideIn 0.75s cubic-bezier(0.22,1,0.36,1) ${0.12 + i * 0.1}s both`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 11, marginBottom: 4 }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10.5,
                    color: p.peligro ? 'var(--alert)' : p.cierre ? 'var(--verdant)' : 'var(--hydro)',
                    letterSpacing: '0.1em',
                  }}
                >
                  <span>{`0${i + 1}`}</span>
                </span>
                <span className="font-display" style={{ fontSize: 22, color: 'var(--moon)', lineHeight: 1.15 }}>
                  <span>{p.t}</span>
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                <span>{p.d}</span>
              </p>
            </Glass>
          ))}
        </div>

        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Moon size={128} phase="eclipse" tone="alert" rings={1} className="crystal-in" />
          </div>

          <Callout kind="alert" title="El capacitor guarda energía">
            Un desfibrilador desconectado sigue siendo peligroso. <Alert>Descargar antes de intervenir</Alert> no es
            una recomendación: es el paso que evita el accidente.
          </Callout>

          <Callout kind="verdant" title="El criterio de salida">
            Sólo cuando la lectura cae dentro de los límites el equipo se declara{' '}
            <Lunar>eléctricamente seguro</Lunar>. Si no, permanece fuera de servicio y etiquetado como tal.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
