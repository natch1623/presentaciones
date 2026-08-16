import { SlideLayout, SlideTag, SlideTitle, SpecTable, Glass, Hydro, Lunar, Callout } from './SlideLayout'
import { Moon, WaveLine } from '../components/Celestial'

/**
 * La orden de trabajo y su contenido mínimo. Es el entregable que se
 * evalúa en la Clase 3, así que la tabla vale por sí sola como
 * plantilla de referencia.
 */
export default function S51_OrdenTrabajo() {
  const CAMPOS: string[][] = [
    ['Identificación del equipo', 'Marca, modelo, nº de serie, nº de inventario, ubicación o servicio'],
    ['Síntoma', 'Reportado por el usuario —en sus palabras— y verificado por el técnico'],
    ['Diagnóstico', 'Causa raíz identificada y bloque funcional afectado'],
    ['Acción correctiva', 'Qué se hizo; repuestos con número de parte'],
    ['Verificación', 'Pruebas funcionales y de seguridad eléctrica con valores medidos frente a límites'],
    ['Datos administrativos', 'Fecha, tiempo empleado, técnico responsable, estado final del equipo'],
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 8 · 8.1</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>La orden de trabajo:</span> <Hydro><span>contenido mínimo</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 26, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 16px' }}>
            <span>
              Es el registro formal de la intervención. Cada campo existe porque alguien lo va a necesitar después:
              el próximo técnico, el jefe de servicio o una auditoría.
            </span>
          </p>

          <SpecTable
            head={['Campo', 'Qué se registra']}
            cols="1fr 2fr"
            fontSize={12.5}
            rows={CAMPOS}
            toneOf={(r, c) => (r === 4 && c === 1 ? 'cyan' : undefined)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
          <Glass tone="violet" ornament style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Moon size={32} phase="crescent" tone="violet" halo={false} />
              <span className="font-display" style={{ fontSize: 21, color: 'var(--moon)' }}>
                <span>El campo que más se descuida</span>
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
              <span>
                La verificación. No basta con anotar «se reparó»: hay que dejar los valores medidos y los límites
                contra los que se compararon. Sin esos números no hay forma de demostrar que el equipo salió dentro
                de tolerancia.
              </span>
            </p>
          </Glass>

          <Callout kind="hydro" title="Síntoma, en dos versiones">
            El del usuario y el del técnico. Cuando difieren, esa diferencia <Lunar>es información</Lunar>: suele
            señalar un problema de operación, no de equipo.
          </Callout>

          <div aria-hidden style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <WaveLine width={280} height={28} tone="hydro" opacity={0.25} />
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
