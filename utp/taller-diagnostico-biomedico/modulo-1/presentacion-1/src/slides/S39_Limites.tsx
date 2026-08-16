import { SlideLayout, SlideTag, SlideTitle, SpecTable, Hydro, Lunar, Callout } from './SlideLayout'
import { Ripples } from '../components/Celestial'

/**
 * Valores límite de referencia de IEC 60601‑1.
 *
 * La advertencia normativa es tan importante como la tabla: estos son
 * los valores clásicos que cita la literatura, y para un dictamen
 * formal hay que ir a la edición vigente y al manual del equipo.
 */
export default function S39_Limites() {
  const LIMITES: string[][] = [
    ['A tierra (equipo general)', '≤ 5 mA', '≤ 10 mA'],
    ['Por la envolvente / chasis', '≤ 100 µA', '≤ 500 µA'],
    ['De paciente — tipo B y BF (CA)', '≤ 100 µA', '≤ 500 µA'],
    ['De paciente — tipo CF (CA)', '≤ 10 µA', '≤ 50 µA'],
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 6 · 6.6 · valores de referencia</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Los números contra los que</span> <Hydro><span>se compara la lectura</span></Hydro>
      </SlideTitle>

      <div aria-hidden style={{ position: 'absolute', right: 56, top: 120, opacity: 0.3, pointerEvents: 'none' }}>
        <Ripples size={320} tone="hydro" count={4} />
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 900 }}>
        <span>
          Los valores clásicos de la norma, ampliamente citados en la literatura —Webster, Cromwell—. Se miden en
          condición normal y en condición de primer defecto, y el veredicto sale de comparar ambas columnas.
        </span>
      </p>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <SpecTable
          head={['Corriente de fuga', 'Condición normal (NC)', 'Primer defecto (SFC)']}
          cols="1.6fr 1fr 1fr"
          fontSize={14}
          rows={LIMITES}
          toneOf={(r, c) => (r === 3 ? (c === 0 ? 'alert' : 'alert') : c > 0 ? 'cyan' : undefined)}
        />

        <p style={{ fontSize: 12, color: 'var(--moon-faint)', lineHeight: 1.6, margin: '18px 0 0', maxWidth: 900 }}>
          <span>La fila de </span>
          <Lunar>
            <span>tipo CF</span>
          </Lunar>
          <span>
            {' '}es diez veces más estricta que las demás: es la parte aplicada que llega al corazón, donde bastan
            microamperios para provocar fibrilación.
          </span>
        </p>
      </div>

      <Callout kind="ember" title="Advertencia normativa">
        Estos valores son de referencia didáctica. Las ediciones de la norma introducen matices —corriente CC,
        condiciones de red, subtipos—. Para un dictamen formal, tomar los límites de la edición vigente de IEC
        60601‑1 aplicable y del manual del fabricante, <Lunar>nunca de memoria</Lunar>.
      </Callout>
    </SlideLayout>
  )
}
