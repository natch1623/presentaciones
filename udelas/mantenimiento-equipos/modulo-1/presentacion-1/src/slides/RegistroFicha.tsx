import { Panel } from './SlideLayout'

/**
 * La ficha que se entrega al terminar la práctica. Se repite en los
 * seis equipos cambiando sólo los campos, así que vive acá.
 *
 * Va dibujada con líneas de escritura y no con casillas: la idea es que
 * se lea como un formulario en papel, que es como se llena en el taller.
 */
export default function RegistroFicha({
  equipo,
  campos,
  nota,
}: {
  equipo: string
  /** [nombre del campo, unidad o valores admitidos] */
  campos: [string, string][]
  nota?: string
}) {
  return (
    <Panel label={`Ficha de servicio · ${equipo}`} tone="mint" style={{ minWidth: 0 }}>
      <div
        style={{
          padding: '14px 16px',
          background: 'linear-gradient(160deg, rgba(19,26,64,0.5), rgba(4,5,14,0.7))',
          borderLeft: '2px solid var(--mint)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
        }}
      >
        {campos.map(([k, u], i) => (
          <div
            key={k}
            className="stagger-item"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              padding: '6px 0',
              borderBottom: i < campos.length - 1 ? '1px dashed rgba(234,246,255,0.13)' : 'none',
              animationDelay: `${0.1 + i * 0.05}s`,
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--ice-dim)', whiteSpace: 'nowrap' }}>
              <span>{k}</span>
            </span>
            <span style={{ flex: 1, borderBottom: '1px solid rgba(143,220,255,0.18)', height: 1 }} />
            <span
              className="font-mono"
              style={{ fontSize: 9, color: 'var(--ice-faint)', whiteSpace: 'nowrap' }}
            >
              <span>{u}</span>
            </span>
          </div>
        ))}

        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px solid rgba(79,227,193,0.25)',
            display: 'flex',
            gap: 8,
          }}
        >
          {['Apto', 'En observación', 'Fuera de servicio'].map((r, i) => (
            <span
              key={r}
              className="font-mono"
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 8.5,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '5px 4px',
                color: i === 0 ? 'var(--mint)' : i === 1 ? 'var(--amber)' : 'var(--crimson)',
                border: `1px solid ${i === 0 ? 'rgba(79,227,193,0.35)' : i === 1 ? 'rgba(255,180,77,0.35)' : 'rgba(255,77,106,0.35)'}`,
                clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
              }}
            >
              <span>{r}</span>
            </span>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 10, color: 'var(--ice-faint)', lineHeight: 1.5, margin: '10px 0 0' }}>
        <span>
          {nota ??
            'Se entrega con el valor medido, no con un visto bueno. Firma, fecha y próximo servicio.'}
        </span>
      </p>
    </Panel>
  )
}
