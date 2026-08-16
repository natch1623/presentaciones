import type { ReactNode } from 'react'
import { SlideLayout, SlideTag, SlideTitle, Glass, Bullet } from './SlideLayout'
import CadenaFuncional from '../components/CadenaFuncional'
import { Moon } from '../components/Celestial'

/**
 * Plantilla de las diapositivas que desmenuzan una etapa de la cadena
 * funcional. Cinco diapositivas comparten esta estructura, así que
 * vive acá: encabezado, principio a la izquierda, fallas típicas a la
 * derecha y la cadena en miniatura al pie con la etapa encendida.
 *
 * Esa miniatura es lo que evita que el participante pierda de vista
 * dónde está mientras se abre cada etapa por separado.
 */
export default function EtapaCadena({
  num,
  activo,
  titulo,
  principio,
  fallas,
  children,
  tone = 'hydro',
}: {
  num: string
  activo: number
  titulo: ReactNode
  principio: ReactNode
  fallas: ReactNode[]
  children?: ReactNode
  tone?: 'hydro' | 'violet' | 'cyan'
}) {
  return (
    <SlideLayout>
      <SlideTag tone={tone}>
        <span>{`Bloque 2 · ${num}`}</span>
      </SlideTag>
      <SlideTitle size="md">{titulo}</SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.85fr', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <p style={{ fontSize: 13.5, color: 'var(--moon-dim)', lineHeight: 1.75, margin: 0 }}>{principio}</p>
          {children}
        </div>

        <Glass tone="alert" style={{ display: 'flex', flexDirection: 'column', gap: 11, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Moon size={26} phase="eclipse" tone="rose" halo={false} />
            <span
              className="font-mono"
              style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--alert)', textTransform: 'uppercase' }}
            >
              <span>Fallas típicas</span>
            </span>
          </div>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fallas.map((f, i) => (
              <Bullet key={i} tone="alert">
                {f}
              </Bullet>
            ))}
          </div>
        </Glass>
      </div>

      {/* La cadena, en miniatura, con esta etapa encendida */}
      <div style={{ height: 92, marginTop: 14, flexShrink: 0 }}>
        <CadenaFuncional activo={activo} variant="mini" />
      </div>
    </SlideLayout>
  )
}
