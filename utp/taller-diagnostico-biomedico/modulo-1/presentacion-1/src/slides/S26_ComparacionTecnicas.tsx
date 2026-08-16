import { SlideLayout, SlideTag, SlideTitle, SpecTable, Hydro, Callout } from './SlideLayout'
import { Ripples } from '../components/Celestial'

/**
 * Cuándo usar cada técnica. Es la tabla que conviene tener a mano
 * durante los casos guiados de la Clase 3: la elección de la técnica
 * es parte del diagnóstico, no un detalle de estilo.
 */
export default function S26_ComparacionTecnicas() {
  const FILAS: string[][] = [
    ['División a la mitad', 'La cadena es larga y en serie', 'Mínimo número de mediciones', 'Requiere acceso al punto medio y conocer el valor esperado'],
    ['Rastreo de señal', 'Se dispone de señal patrón', 'Muy visual; localiza la etapa exacta', 'Más lento; muchos puntos de medida'],
    ['Sustitución', 'Equipo modular con repuestos', 'Confirmación rápida de la hipótesis', 'Puede dañar el repuesto; requiere stock'],
    ['Bracketing', 'Se conocen extremos bueno y malo', 'Simple e intuitiva', 'Menos eficiente que el half‑split puro'],
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 4 · 4.5</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Cuándo usar</span> <Hydro><span>cada técnica</span></Hydro>
      </SlideTitle>

      <div aria-hidden style={{ position: 'absolute', right: 40, top: 90, opacity: 0.35, pointerEvents: 'none' }}>
        <Ripples size={300} tone="violet" count={3} />
      </div>

      <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 880 }}>
        <span>
          Ninguna es mejor en abstracto: cada una encaja con una situación distinta del banco. La pregunta correcta
          no es «qué técnica sé usar», es «qué me permite el equipo que tengo enfrente».
        </span>
      </p>

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <SpecTable
          head={['Técnica', 'Mejor cuando…', 'Ventaja', 'Limitación']}
          cols="1fr 1.2fr 1.2fr 1.5fr"
          fontSize={12.5}
          rows={FILAS}
          toneOf={(r, c) => (c === 2 ? 'cyan' : c === 3 && r === 2 ? 'ember' : undefined)}
        />
      </div>

      <Callout kind="hydro" title="En la práctica se combinan">
        Lo habitual es acotar con bracketing, cerrar con división a la mitad y confirmar por sustitución. El rastreo
        de señal es el que enseña: es el que se usa en la Clase 3 para que se vea dónde muere la onda.
      </Callout>
    </SlideLayout>
  )
}
