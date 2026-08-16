import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * Bibliografía de referencia. Cada entrada dice qué aporta al taller,
 * no sólo su título: así se sabe a cuál volver según lo que se quiera
 * profundizar.
 */
export default function S55_Bibliografia() {
  const FUENTES = [
    {
      a: 'Carr, J. J. & Brown, J. M.',
      t: 'Introduction to Biomedical Equipment Technology',
      d: 'Metodología de troubleshooting de equipo médico.',
      tono: 'hydro' as const,
    },
    {
      a: 'Cromwell, Weibell & Pfeiffer',
      t: 'Biomedical Instrumentation and Measurements',
      d: 'Bloques funcionales, señales fisiológicas y seguridad.',
      tono: 'violet' as const,
    },
    {
      a: 'Webster, J. G. (ed.)',
      t: 'Medical Instrumentation: Application and Design',
      d: 'Principios, sensores, seguridad eléctrica y corrientes de fuga.',
      tono: 'cyan' as const,
    },
    {
      a: 'Floyd, T. L.',
      t: 'Principios de Circuitos Eléctricos',
      d: 'Método sistemático: división a la mitad y rastreo de señal.',
      tono: 'hydro' as const,
    },
    {
      a: 'IEC 60601‑1 · NFPA 99 / AAMI',
      t: 'Normas de seguridad eléctrica',
      d: 'Clases, tipos de parte aplicada y valores de seguridad eléctrica.',
      tono: 'rose' as const,
    },
    {
      a: 'OMS',
      t: 'Serie técnica de dispositivos médicos',
      d: 'Inspección, mantenimiento preventivo y programa de mantenimiento. Disponible en español.',
      tono: 'violet' as const,
    },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bibliografía de referencia</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>De dónde sale</span> <Hydro><span>todo esto</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, minHeight: 0 }}>
        {FUENTES.map((f, i) => (
          <Glass
            key={f.t}
            tone={f.tono}
            open
            style={{
              display: 'flex',
              gap: 14,
              padding: '14px 18px',
              animation: `veilRise 0.8s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.09}s both`,
            }}
          >
            <Moon size={26} phase={i % 2 === 0 ? 'crescent' : 'ring'} tone={f.tono} halo={false} style={{ marginTop: 3 }} />

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: 'var(--moon)', fontWeight: 500, marginBottom: 2 }}>
                <span>{f.a}</span>
              </div>
              <div className="font-display" style={{ fontSize: 18, color: 'var(--hydro-soft)', lineHeight: 1.25, marginBottom: 5 }}>
                <span>{f.t}</span>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
                <span>{f.d}</span>
              </p>
            </div>
          </Glass>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 18 }}>
        <Spark size={10} tone="cyan" />
        <p style={{ fontSize: 12, color: 'var(--moon-faint)', margin: 0, textAlign: 'center' }}>
          <span>
            Material teórico ampliado · Taller de Diagnóstico Biomédico · Prof. Ing. Bryan Rodríguez
          </span>
        </p>
        <Spark size={10} tone="cyan" />
      </div>
    </SlideLayout>
  )
}
