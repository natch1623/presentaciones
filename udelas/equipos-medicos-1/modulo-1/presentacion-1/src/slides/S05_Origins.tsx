import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'
import listonPortrait from '../assets/photos/robert-liston-portrait.jpg'

export default function S05_Origins() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Antes de 1846: rapidez como <CyanAccent>única anestesia</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {[
            {
              label: 'Dónde se operaba',
              text: 'Anfiteatros públicos, mesas de cocina, campos de batalla o el domicilio del paciente.',
            },
            {
              label: 'Sin asepsia ni antisepsia',
              text: 'El cirujano operaba con levita de calle y usaba el mismo instrumental entre pacientes sin limpieza alguna.',
            },
            {
              label: 'Limitaciones extremas',
              text: 'El dolor y la hemorragia limitaban la duración. Las amputaciones se medían en segundos.',
            },
            {
              label: 'Mortalidad postoperatoria',
              text: 'La "gangrena de hospital", sepsis y fiebre puerperal superaban el 40–50% en cirugía mayor.',
            },
          ].map((item) => (
            <Card key={item.label} accent="none" style={{ padding: '14px 18px' }}>
              <p className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', margin: '0 0 6px', letterSpacing: '0.1em' }}>
                {item.label.toUpperCase()}
              </p>
              <p style={{ fontSize: 14, color: 'var(--white-dim)', margin: 0, lineHeight: 1.6 }}>
                {item.text}
              </p>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
          {/* Historic portrait — hero treatment */}
          <div
            className="card-hover"
            style={{
              flex: '0 0 40%',
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(167,139,250,0.3)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4), 0 0 30px rgba(167,139,250,0.08)',
            }}
          >
            <img
              src={listonPortrait}
              alt="Retrato de Robert Liston, cirujano, 1840"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: 'sepia(0.3) saturate(0.85) contrast(1.05)',
              }}
            />
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 45%, rgba(6,10,36,0.95) 100%)',
              }}
            />
            <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
              <p style={{ fontSize: 15, color: '#e9d5ff', fontWeight: 700, margin: '0 0 3px', textShadow: '0 0 16px rgba(167,139,250,0.5)' }}>
                Robert Liston
              </p>
              <p className="font-mono" style={{ fontSize: 10, color: 'rgba(233,213,255,0.7)', margin: 0, letterSpacing: '0.05em' }}>
                1794–1847 · retrato de C. Turner, 1840
              </p>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16, minHeight: 0 }}>
            {/* Liston stat */}
            <Card accent="violet" style={{ textAlign: 'center', padding: '26px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 11, color: '#a78bfa', letterSpacing: '0.15em', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                RÉCORD DE VELOCIDAD QUIRÚRGICA
              </div>
              <div
                className="font-display"
                style={{ fontSize: 64, color: 'var(--white)', lineHeight: 1 }}
              >
                &lt;30<span style={{ fontSize: 28, color: '#a78bfa' }}>seg</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--white-faint)', margin: '12px 0 0', lineHeight: 1.6 }}>
                Amputaba un muslo en menos de 30 segundos. La velocidad era la única protección contra el dolor.
              </p>
            </Card>

            {/* Key idea */}
            <div
              style={{
                padding: '20px 24px',
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderLeft: '3px solid var(--cyan-bright)',
                borderRadius: 10,
              }}
            >
              <p
                style={{ fontSize: 14, color: 'var(--white)', margin: 0, lineHeight: 1.7 }}
              >
                <strong style={{ color: 'var(--cyan-bright)' }}>Idea clave:</strong>{' '}
                El quirófano moderno no nació de la arquitectura, sino de la necesidad de controlar tres enemigos:{' '}
                <strong>el dolor</strong>, <strong>la infección</strong> y <strong>la hemorragia</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
