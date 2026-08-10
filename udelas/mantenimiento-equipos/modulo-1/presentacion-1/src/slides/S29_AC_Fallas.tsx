import { SlideLayout, SlideTag, SlideTitle, Crimson, SpecTable, Panel, Callout, Figure } from './SlideLayout'

export default function S29_AC_Fallas() {
  const FALLAS: [string, string, string][] = [
    [
      'Presión correcta, temperatura baja',
      'Aire residual en la cámara: purga deficiente, trampa de vapor tapada, fuga que admite aire',
      'Revisar purga y trampa. Prueba de fuga de vacío y Bowie‑Dick.',
    ],
    [
      'No alcanza presión ni temperatura',
      'Resistencia degradada o incrustada · nivel de agua bajo · fuga por el empaque · válvula abierta',
      'Verificar agua y empaque antes de medir la resistencia.',
    ],
    [
      'Fuga de vapor por la puerta',
      'Empaque endurecido, sucio o mal asentado · cierre desajustado · superficie de asiento dañada',
      'Limpiar y reasentar el empaque; si está deformado, reemplazarlo.',
    ],
    [
      'Material mojado al final',
      'Secado recortado · sobrecarga · envoltura inadecuada · condensado sin evacuar',
      'Reducir carga y revisar el drenaje antes de tocar el programa.',
    ],
    [
      'Ciclo cada vez más largo',
      'Incrustación en resistencia y cámara por agua de mala calidad · aislamiento térmico degradado',
      'Descalcificar según manual y corregir la fuente de agua.',
    ],
    [
      'El ciclo se aborta solo',
      'Sensor de temperatura · presostato · enclavamiento de puerta · control',
      'Leer el código de error y comparar el registro físico contra un patrón.',
    ],
    [
      'La válvula de seguridad gotea',
      'Asiento sucio o vencido tras la prueba manual',
      'Reemplazar. No se ajusta, no se lima y no se bloquea.',
    ],
    [
      'Manchas u óxido en la cámara',
      'Cloruros por producto de limpieza o agua inadecuada',
      'Suspender ese producto; evaluar el daño en el acero.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">04 · Esterilizador — diagnóstico</SlideTag>
      <SlideTitle size="md">
        <span>El registro del ciclo dice </span>
        <Crimson><span>en qué fase se rompió el proceso</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Síntoma', 'Causa probable — en orden de descarte', 'Primera acción']}
            cols="0.95fr 1.55fr 1.05fr"
            rows={FALLAS}
            fontSize={10.4}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Panel label="Antes de abrir el equipo" tone="crimson">
            <div
              style={{
                padding: '13px 15px',
                background: 'linear-gradient(100deg, rgba(255,77,106,0.11), rgba(4,5,14,0))',
                borderLeft: '2px solid var(--crimson)',
              }}
            >
              {['Manómetro en cero', 'Cámara fría al tacto', 'Desconectado y etiquetado', 'Depósito drenado'].map(
                (t, i) => (
                  <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'center', marginTop: i ? 7 : 0 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        background: 'var(--crimson)',
                        clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                      }}
                    />
                    <span style={{ fontSize: 11.5, color: 'var(--ice)' }}>
                      <span>{t}</span>
                    </span>
                  </div>
                ),
              )}
            </div>
          </Panel>

          <Figure
            tone="crimson"
            height={134}
            file="autoclave/registro-ciclo.jpg"
            hint="Impresión o captura del registro de un ciclo, con la meseta marcada."
            caption="La meseta corta o irregular es el hallazgo más común."
          />

          <Callout kind="crimson" title="Recipiente a presión">
            Ninguna intervención sobre válvulas, tapa o cámara se hace con presión residual. Un
            manómetro que marca cero pero está descalibrado es una trampa: verificar también que la
            cámara esté fría.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
