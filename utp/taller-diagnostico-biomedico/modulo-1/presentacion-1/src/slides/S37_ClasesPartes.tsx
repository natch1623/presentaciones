import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Bullet, Badge, Callout, Panel } from './SlideLayout'
import { Moon } from '../components/Celestial'

/**
 * Clases de protección y tipos de parte aplicada.
 *
 * Van en la misma diapositiva porque responden a las dos mitades de la
 * misma pregunta: cómo se protege el equipo frente a la red, y cómo se
 * protege al paciente en el punto de contacto.
 */
export default function S37_ClasesPartes() {
  const CLASES = [
    {
      t: 'Clase I',
      tono: 'hydro' as const,
      d: 'Aislamiento básico MÁS conexión de las partes conductoras accesibles a la tierra de protección. Si el aislamiento básico falla, la corriente se deriva a tierra y actúa la protección.',
      nota: 'Depende de una tierra íntegra: de ahí la importancia de medir su continuidad.',
    },
    {
      t: 'Clase II',
      tono: 'violet' as const,
      d: 'Doble aislamiento o aislamiento reforzado. No depende de la tierra de protección.',
      nota: 'Se identifica por el símbolo de doble cuadro.',
    },
    {
      t: 'Fuente eléctrica interna',
      tono: 'cyan' as const,
      d: 'Alimentado por batería. Su seguridad frente a la red aplica cuando se conecta el cargador.',
      nota: 'No exime de las pruebas: sólo cambia cuándo se hacen.',
    },
  ]

  const TIPOS = [
    {
      t: 'B',
      idea: 'No flotante',
      app: 'Contacto no conductor, sin acceso cardíaco',
      prot: 'Básica',
      tono: 'hydro' as const,
      fase: 'crescent' as const,
    },
    {
      t: 'BF',
      idea: 'Flotante, aislada de tierra',
      app: 'Contacto con paciente, sin acceso cardíaco directo',
      prot: 'Mayor',
      tono: 'violet' as const,
      fase: 'eclipse' as const,
    },
    {
      t: 'CF',
      idea: 'Flotante, grado máximo',
      app: 'Aplicación cardíaca directa: catéteres, ECG intracardíaco',
      prot: 'La más estricta',
      tono: 'alert' as const,
      fase: 'full' as const,
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 6 · 6.3 y 6.4</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Cómo se protege el equipo y</span> <Hydro><span>cómo se protege al paciente</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 26, flex: 1, minHeight: 0 }}>
        {/* ── Clases de protección frente a la red ── */}
        <Panel label="Clases de protección frente a la red" tone="hydro">
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: '0 0 12px' }}>
            <span>
              La norma razona en términos de medios de protección —aislamiento, separación y puesta a tierra—, con
              niveles reforzados cuando lo que se protege es el paciente.
            </span>
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Badge tone="hydro">MOP · medio de protección</Badge>
            <Badge tone="violet">MOPP · para el paciente</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {CLASES.map((c, i) => (
              <Glass
                key={c.t}
                tone={c.tono}
                open
                style={{
                  padding: '12px 16px',
                  animation: `glideIn 0.72s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.1}s both`,
                }}
              >
                <div className="font-display" style={{ fontSize: 20, color: 'var(--moon)', marginBottom: 4 }}>
                  <span>{c.t}</span>
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.55, margin: '0 0 5px' }}>
                  <span>{c.d}</span>
                </p>
                <p style={{ fontSize: 11, color: 'var(--cyan)', lineHeight: 1.5, margin: 0 }}>
                  <span>{c.nota}</span>
                </p>
              </Glass>
            ))}
          </div>
        </Panel>

        {/* ── Tipos de parte aplicada ── */}
        <Panel label="Tipos de parte aplicada" tone="violet">
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: '0 0 14px' }}>
            <span>
              La parte aplicada es la que entra en contacto físico con el paciente para cumplir la función:
              electrodos, sensor de SpO₂, manguito. Se clasifica por su grado de protección contra descargas.
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TIPOS.map((t, i) => (
              <Glass
                key={t.t}
                tone={t.tono}
                ornament
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 18px',
                  animation: `gravityPull 0.88s cubic-bezier(0.22,1,0.36,1) ${0.16 + i * 0.12}s both`,
                }}
              >
                <Moon size={48} phase={t.fase} tone={t.tono} halo={false}>
                  <span
                    className="font-rune"
                    style={{ fontSize: t.t.length > 1 ? 15 : 19, color: 'var(--moon)', letterSpacing: '0.04em' }}
                  >
                    {t.t}
                  </span>
                </Moon>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--moon)', marginBottom: 3 }}>
                    <span>{t.idea}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
                    <span>{t.app}</span>
                  </p>
                </div>

                <Badge tone={t.tono}>{t.prot}</Badge>
              </Glass>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            <Bullet tone="violet">
              El grado de protección sube con el <Lunar>acceso al corazón</Lunar>: es lo que justifica que los
              límites de fuga de CF sean diez veces más bajos que los de B y BF.
            </Bullet>
          </div>
        </Panel>
      </div>

      <div style={{ marginTop: 14 }}>
        <Callout kind="ember" title="Lo que hay que saber leer">
          El símbolo impreso en la placa del equipo dice su clase y el tipo de sus partes aplicadas. Esa información
          determina qué pruebas corresponden y contra qué límites se comparan.
        </Callout>
      </div>
    </SlideLayout>
  )
}
