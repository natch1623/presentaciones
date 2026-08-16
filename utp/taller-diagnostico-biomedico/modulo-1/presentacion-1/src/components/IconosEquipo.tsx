import type { CSSProperties } from 'react'

/**
 * Iconografía de las familias de equipo.
 *
 * Trazo fino, sin relleno y de un solo color, como pide el §13: nada
 * de iconos multicolores que rompan la atmósfera. Se dibujan sobre una
 * rejilla de 24 × 24 y se escalan con `size`.
 */

export type EquipoId =
  | 'monitor'
  | 'bomba'
  | 'ventilador'
  | 'fototerapia'
  | 'electrobisturi'
  | 'desfibrilador'
  | 'incubadora'

const TRAZOS: Record<EquipoId, string[]> = {
  // Pantalla con trazo de ECG
  monitor: [
    'M2.5 4.5h19v13h-19z',
    'M9 21h6M12 17.5V21',
    'M5 11.5h2.5l1.5-3 2 6 1.5-3H16',
  ],
  // Cuerpo de bomba con gota y línea de infusión
  bomba: [
    'M4 3.5h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z',
    'M9.5 7.5c1.6 2 2.6 3.3 2.6 4.4a2.6 2.6 0 0 1-5.2 0c0-1.1 1-2.4 2.6-4.4z',
    'M17 9h3.5v8M20.5 17v3',
  ],
  // Fuelle con circuito paciente
  ventilador: [
    'M3 7.5h9v9H3z',
    'M3 10.5h9M3 13.5h9',
    'M12 12h3.5a3 3 0 0 1 3 3v1.5',
    'M18.5 20.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    'M15.5 5.5h6',
  ],
  // Lámpara con haz de luz azul
  fototerapia: [
    'M4.5 3.5h15l-2 4h-11z',
    'M12 7.5v2',
    'M7 12.5l-1.5 3M12 12.5v3.5M17 12.5l1.5 3',
    'M5 20.5h14',
  ],
  // Lápiz activo con descarga de RF
  electrobisturi: [
    'M6 18.5l9.5-9.5 2.5 2.5L8.5 21H6z',
    'M15.5 9L18 6.5l2.5 2.5L18 11.5',
    'M3.5 6.5l2 2M3 11h2.5M6.5 3v2.5',
  ],
  // Corazón con rayo
  desfibrilador: [
    'M12 20.5S3.5 15 3.5 9.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 8.5 1.8c0 5.8-8.5 11.3-8.5 11.3z',
    'M12.5 10l-2.5 3.5h2.5L11.5 17l3-4h-2.5z',
  ],
  // Cúpula con sensor de temperatura
  incubadora: [
    'M3 16.5V12a9 9 0 0 1 18 0v4.5',
    'M2 16.5h20v4H2z',
    'M12 7v5.5',
    'M12 12.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z',
    'M8 20.5v1.5M16 20.5v1.5',
  ],
}

export default function IconoEquipo({
  id,
  size = 34,
  color = 'var(--hydro-soft)',
  style,
}: {
  id: EquipoId
  size?: number
  color?: string
  style?: CSSProperties
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      style={{ width: size, height: size, flexShrink: 0, ...style }}
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {TRAZOS[id].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
