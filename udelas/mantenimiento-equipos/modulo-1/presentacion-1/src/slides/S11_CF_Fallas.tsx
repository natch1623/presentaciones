import { SlideLayout, SlideTag, SlideTitle, Crimson, SpecTable, Callout, Figure, Panel } from './SlideLayout'

/**
 * Diagnóstico. Las causas van en orden de probabilidad, que es el
 * orden en que conviene descartarlas: empezar por la tarjeta de control
 * cuando el problema es una carga mal balanceada cuesta tiempo y piezas.
 */
export default function S11_CF_Fallas() {
  const FALLAS: [string, string, string][] = [
    [
      'Vibra o "camina" sobre el mesón',
      'Carga desbalanceada · rotor mal asentado · amortiguadores endurecidos · rodamientos · mesón sin nivelar',
      'Recargar en cruz y repetir. Si sigue, reasentar el rotor al par y nivelar.',
    ],
    [
      'No arranca',
      'Tapa mal cerrada · microswitch del enclavamiento · fusible · cordón · tarjeta',
      'Continuidad del microswitch y fusible antes de abrir la tarjeta.',
    ],
    [
      'Arranca y aborta a los segundos',
      'Detección de desbalance · protección térmica · escobillas al límite',
      'Verificar carga; dejar enfriar 20 min; medir longitud de escobilla.',
    ],
    [
      'No alcanza las rpm programadas',
      'Escobillas gastadas · sensor de velocidad sucio · rotor mal seleccionado en el menú · control',
      'Limpiar el sensor óptico y confirmar el rotor declarado. Luego escobillas.',
    ],
    [
      'Ruido metálico en marcha',
      'Rodamientos · rotor rozando la cuba · tubo roto · pieza suelta',
      'Detener de inmediato. No reiniciar hasta inspeccionar la cuba.',
    ],
    [
      'No frena o tarda demasiado',
      'Freno electrónico · tarjeta · perfil de desaceleración mal configurado',
      'Cronometrar la detención y comparar con el manual.',
    ],
    [
      'Residuo o líquido en la cuba',
      'Tubo roto durante el giro',
      'Protocolo de aerosol: 10 min con tapa cerrada, EPP, descontaminar y revisar el rotor.',
    ],
    [
      'Olor a quemado o humo',
      'Motor · escobillas · aislamiento · tarjeta',
      'Desconectar y etiquetar fuera de servicio. No volver a energizar.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">01 · Centrífuga — diagnóstico</SlideTag>
      <SlideTitle size="md">
        <span>Del síntoma a la causa </span>
        <Crimson><span>sin cambiar piezas a ciegas</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Síntoma', 'Causa probable — en orden de descarte', 'Primera acción']}
            cols="0.9fr 1.5fr 1.15fr"
            rows={FALLAS}
            fontSize={10.6}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Figure
            tone="crimson"
            height={150}
            file="centrifuga/rotor-corrosion.jpg"
            hint="Detalle de picaduras o corrosión en el pozo de un rotor de aluminio."
            caption="La corrosión empieza en el pozo, donde queda el residuo."
          />

          <Panel label="Regla de descarte" tone="rift">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Primero', 'lo que no cuesta: carga, nivelación, limpieza, cierre.'],
                ['Después', 'lo que se mide: escobillas, tierra, rpm, tiempo.'],
                ['Al final', 'lo que se reemplaza: rodamiento, tarjeta, motor.'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 9, alignItems: 'baseline' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--rift-soft)',
                      minWidth: 52,
                    }}
                  >
                    <span>{k}</span>
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--ice-dim)', lineHeight: 1.45 }}>
                    <span>{v}</span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Callout kind="amber" title="Antes de abrir">
            Reproducir la falla y anotar en qué condición aparece: con carga o sin ella, en frío o
            caliente, a qué velocidad. Una falla que no se sabe reproducir no se puede dar por resuelta.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
