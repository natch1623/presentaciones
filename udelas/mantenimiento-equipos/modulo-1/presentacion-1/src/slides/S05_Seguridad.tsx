import { SlideLayout, SlideTag, SlideTitle, Crimson, Panel, Figure, Step } from './SlideLayout'

/**
 * Seguridad transversal: lo que aplica a los seis equipos antes de
 * tocar ninguno. Se ordena por tipo de energía o agente, porque así es
 * como se decide qué EPP y qué corte hace falta.
 */
export default function S05_Seguridad() {
  const RIESGOS = [
    {
      k: 'Biológico',
      color: 'var(--mint)',
      icon: <IconBio />,
      items: [
        'El equipo se descontamina antes de entrar a servicio: quien lo usa lo entrega limpio.',
        'Centrífuga con tubo roto: esperar 10 min con la tapa cerrada antes de abrir — el aerosol necesita sedimentar.',
        'Bandeja de agua de la incubadora y depósito del lavador: reservorios de hongos y biofilm.',
      ],
    },
    {
      k: 'Eléctrico',
      color: 'var(--frost)',
      icon: <IconBolt />,
      items: [
        'Apagar no es aislar: se desconecta el tomacorriente y se etiqueta.',
        'Continuidad del conductor de tierra ≤ 0,2 Ω y corriente de fuga dentro de norma.',
        'Nunca eliminar la espiga de tierra ni usar adaptadores de dos patas en equipo de laboratorio.',
      ],
    },
    {
      k: 'Presión y calor',
      color: 'var(--crimson)',
      icon: <IconPressure />,
      items: [
        'Autoclave: no se abre ni se desarma hasta que el manómetro marque cero y la cámara esté fría.',
        'La válvula de seguridad no se ajusta ni se bloquea: se prueba y, si falla, se reemplaza.',
        'Superficies y vapor a más de 120 °C: guante térmico, no de nitrilo.',
      ],
    },
    {
      k: 'Mecánico y UV',
      color: 'var(--rift-soft)',
      icon: <IconRotor />,
      items: [
        'El enclavamiento de tapa de la centrífuga se prueba en cada rutina; jamás se puentea.',
        'Rotor con corrosión o fuera de vida útil: se retira del servicio, no se repara.',
        'Lámpara UV de la cabina: apagada mientras haya alguien adelante; degrada plásticos y sellos.',
      ],
    },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">Antes de tocar cualquier equipo</SlideTag>
      <SlideTitle size="md">
        <span>Cuatro energías que hay que </span>
        <Crimson><span>cortar, contener o esperar</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 18, flex: 1, minHeight: 0 }}>
        {RIESGOS.map((r, i) => (
          <div
            key={r.k}
            className="stagger-item"
            style={{ display: 'flex', flexDirection: 'column', minWidth: 0, animationDelay: `${0.06 + i * 0.08}s` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <span style={{ color: r.color, display: 'flex' }}>{r.icon}</span>
              <span className="font-display" style={{ fontSize: 20, color: 'var(--ice)', lineHeight: 1 }}>
                <span>{r.k}</span>
              </span>
            </div>
            <div
              style={{
                height: 1,
                background: `linear-gradient(90deg, ${r.color}, transparent)`,
                marginBottom: 11,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {r.items.map((t, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 5,
                      width: 6,
                      height: 6,
                      background: r.color,
                      clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                    }}
                  />
                  <p style={{ fontSize: 11, color: 'var(--ice-dim)', lineHeight: 1.5, margin: 0 }}>
                    <span>{t}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Franja inferior: bloqueo y EPP ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 26, marginTop: 18 }}>
        <Panel label="Bloqueo y etiquetado — se hace siempre, sin excepción" tone="crimson">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <Step n="1" title="Apagar" tone="crimson">Con su propio interruptor, no desde el tomacorriente.</Step>
            <Step n="2" title="Desconectar" tone="crimson">Retirar el enchufe, cerrar gas, aliviar presión, drenar.</Step>
            <Step n="3" title="Etiquetar" tone="crimson">Tarjeta con nombre, fecha y motivo en el punto de corte.</Step>
            <Step n="4" title="Verificar" tone="crimson">Intentar encender: el equipo no debe responder.</Step>
          </div>
        </Panel>

        <Figure
          tone="mint"
          height={128}
          file="epp-laboratorio.jpg"
          hint="EPP mínimo del módulo: bata, guantes de nitrilo, gafas y guante térmico."
          caption="El EPP se elige por el agente, no por costumbre."
        />
      </div>
    </SlideLayout>
  )
}

/* ── Íconos angulares, dibujados para que peguen con las esquirlas ── */

function IconBio() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 9.4 A 5.2 5.2 0 0 0 7.5 3.6 M12 9.4 A 5.2 5.2 0 0 1 16.5 3.6" />
      <path d="M9.8 13.4 A 5.2 5.2 0 0 0 4.2 15.6 M9.8 13.4 A 5.2 5.2 0 0 1 6.6 20.6" />
      <path d="M14.2 13.4 A 5.2 5.2 0 0 1 19.8 15.6 M14.2 13.4 A 5.2 5.2 0 0 0 17.4 20.6" />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M13.5 2 L5.5 13.5 H11 L9.5 22 L18 10 H12.5 Z" strokeLinejoin="round" />
    </svg>
  )
}

function IconPressure() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 13 L15.6 9.6" strokeLinecap="round" />
      <path d="M12 2.6 V5.2" strokeLinecap="round" />
      <path d="M5.2 6.2 L6.9 7.9 M18.8 6.2 L17.1 7.9" strokeLinecap="round" />
    </svg>
  )
}

function IconRotor() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 3.2 L19.6 7.6 V16.4 L12 20.8 L4.4 16.4 V7.6 Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 4.6 V9.8 M18.2 8.6 L13.9 11 M18.2 15.4 L13.9 13 M12 19.4 V14.2 M5.8 15.4 L10.1 13 M5.8 8.6 L10.1 11" />
    </svg>
  )
}
