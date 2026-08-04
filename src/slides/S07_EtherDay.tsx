import { SlideLayout, CyanAccent, Card, Badge } from './SlideLayout'
import etherDomePhoto from '../assets/photos/ether-dome-daguerreotype.png'

export default function S07_EtherDay() {
  return (
    <SlideLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, height: '100%', minHeight: 0 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
          <Badge variant="cyan">16 de octubre de 1846</Badge>
          <h2
            className="font-display"
            style={{ fontSize: 36, color: 'var(--white)', margin: '16px 0', lineHeight: 1.2 }}
          >
            El <CyanAccent>"Ether Day"</CyanAccent>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--white-dim)', lineHeight: 1.7, margin: 0 }}>
            Massachusetts General Hospital, Boston
          </p>

          <div
            style={{
              margin: '24px 0',
              padding: '20px 24px',
              background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 12,
            }}
          >
            <p
              className="font-display"
              style={{
                fontSize: 20,
                color: 'var(--cyan-bright)',
                margin: 0,
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              "Gentlemen, this is no humbug."
            </p>
            <p
              style={{
                fontSize: 12,
                color: 'var(--white-faint)',
                margin: '10px 0 0',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              — John Collins Warren, cirujano
            </p>
          </div>

          <p style={{ fontSize: 13, color: 'var(--white-faint)', lineHeight: 1.6, margin: 0 }}>
            El anfiteatro donde ocurrió se conserva como el{' '}
            <strong style={{ color: 'var(--cyan-mid)' }}>"Ether Dome"</strong>.
          </p>

          {/* Historic photo */}
          <div
            className="stagger-item"
            style={{
              marginTop: 20,
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid rgba(0,212,255,0.22)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4), 0 0 24px rgba(0,212,255,0.06)',
              position: 'relative',
              flex: 1,
              minHeight: 120,
            }}
          >
            <img
              src={etherDomePhoto}
              alt="Daguerrotipo histórico de una cirugía con éter en el Massachusetts General Hospital, 1846"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: 'sepia(0.35) saturate(0.8) brightness(0.85) contrast(1.05)',
              }}
            />
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 55%, rgba(2,7,26,0.92) 100%)',
              }}
            />
            <p
              className="font-mono"
              style={{
                position: 'absolute', bottom: 8, left: 12, right: 12,
                fontSize: 9.5, color: 'rgba(240,249,255,0.65)', margin: 0, lineHeight: 1.4,
              }}
            >
              Daguerrotipo de una cirugía con éter en el MGH, 1846 · Southworth &amp; Hawes — dominio público
            </p>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          {[
            { label: 'Paciente', value: 'Gilbert Abbott', sub: 'Exéresis de tumor vascular en el cuello' },
            { label: 'Cirujano', value: 'John Collins Warren' },
            { label: 'Anestesista', value: 'William T.G. Morton', sub: 'Odontólogo — inventor del inhalador' },
            {
              label: 'Dispositivo',
              value: 'Inhalador de vidrio con éter sulfúrico y válvula unidireccional',
              sub: 'El primer "equipo de anestesia" de la historia',
            },
          ].map((item) => (
            <Card key={item.label} accent="none" style={{ padding: '14px 18px' }}>
              <p className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', margin: '0 0 4px', letterSpacing: '0.1em' }}>
                {item.label.toUpperCase()}
              </p>
              <p style={{ fontSize: 14, color: 'var(--white)', margin: 0, fontWeight: 500 }}>
                {item.value}
              </p>
              {item.sub && (
                <p style={{ fontSize: 12, color: 'var(--white-faint)', margin: '4px 0 0' }}>
                  {item.sub}
                </p>
              )}
            </Card>
          ))}

          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: 10,
            }}
          >
            <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.9)', margin: 0, lineHeight: 1.6 }}>
              <strong>Para ingeniería biomédica:</strong>{' '}
              <span style={{ color: 'var(--white-dim)' }}>
                El inhalador de Morton ya contenía los tres elementos de una máquina de anestesia moderna: (1) reservorio del agente, (2) mecanismo de vaporización, y (3) sistema de conducción unidireccional.
              </span>
            </p>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
