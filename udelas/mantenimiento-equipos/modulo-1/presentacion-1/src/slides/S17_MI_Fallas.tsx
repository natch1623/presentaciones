import { SlideLayout, SlideTag, SlideTitle, Crimson, SpecTable, Panel, Callout, Figure } from './SlideLayout'

export default function S17_MI_Fallas() {
  const FALLAS: [string, string, string][] = [
    [
      'Manchas en el campo',
      'Girar el ocular: si giran, están en el ocular. Mover la muestra: si se mueven, están en el porta. Si no hacen ninguna de las dos, están en el condensador o el objetivo.',
      'Limpiar sólo el elemento identificado, con papel de lente.',
    ],
    [
      'No enfoca nítido en 40× o 100×',
      'Revisar cubreobjetos (0,17 mm), aceite en el 100× y aceite seco en la lente frontal.',
      'Limpiar el objetivo; usar cubreobjetos del espesor correcto.',
    ],
    [
      'Un lado del campo oscuro',
      'Cerrar el diafragma de campo y observar dónde queda el polígono luminoso.',
      'Centrar el condensador · confirmar que el revólver hizo clic.',
    ],
    [
      'Imagen lavada, sin contraste',
      'Retirar un ocular y mirar la pupila de salida del objetivo.',
      'Cerrar el diafragma de apertura al 70–80 %.',
    ],
    [
      'Halos y detalle falso',
      'La misma comprobación: el iris está demasiado cerrado.',
      'Abrir hasta el 70–80 % y bajar el brillo con el reóstato.',
    ],
    [
      'El enfoque se va solo',
      'Enfocar y soltar: la platina baja por su peso.',
      'Ajustar la tensión del macrométrico en el anillo del coaxial.',
    ],
    [
      'No ilumina o parpadea',
      'Lámpara, contactos del portalámpara, fusible, reóstato y cordón.',
      'Reemplazar la lámpara sin tocar el vidrio; limpiar contactos oxidados.',
    ],
    [
      'Imagen doble o fatiga visual',
      'Ajuste dióptrico y distancia interpupilar del usuario.',
      'Reajustar ambos oculares; si persiste, revisar el prisma.',
    ],
    [
      'Filamentos ramificados en la óptica',
      'Hongo por humedad: no se mueve al girar el ocular ni al mover la muestra.',
      'Retirar del ambiente húmedo. Limpieza especializada o reemplazo del elemento.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">02 · Microscopio — diagnóstico</SlideTag>
      <SlideTitle size="md">
        <span>Localizar el defecto </span>
        <Crimson><span>antes de tocar nada</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 264px', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Síntoma', 'Cómo se localiza', 'Acción']}
            cols="0.82fr 1.6fr 1fr"
            rows={FALLAS}
            fontSize={10.4}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Panel label="Las dos preguntas" tone="rift">
            <div
              style={{
                padding: '13px 15px',
                background: 'linear-gradient(100deg, rgba(125,99,255,0.10), rgba(4,5,14,0))',
                borderLeft: '2px solid var(--rift)',
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--ice)', lineHeight: 1.55, margin: '0 0 8px' }}>
                <span>¿La mancha gira cuando giro el ocular?</span>
              </p>
              <p style={{ fontSize: 12, color: 'var(--ice)', lineHeight: 1.55, margin: '0 0 10px' }}>
                <span>¿Se mueve cuando muevo la platina?</span>
              </p>
              <p style={{ fontSize: 10.8, color: 'var(--ice-dim)', lineHeight: 1.5, margin: 0 }}>
                <span>
                  Dos respuestas y el defecto queda localizado en uno de cuatro sitios. Sin esto se
                  termina limpiando toda la óptica y rayando lo que estaba bien.
                </span>
              </p>
            </div>
          </Panel>

          <Figure
            tone="crimson"
            height={132}
            file="microscopio/campo-con-manchas.jpg"
            hint="Captura del campo visual con manchas y con iluminación despareja, para comparar."
          />

          <Callout kind="amber" title="Antes de declarar avería">
            Muchos reclamos vienen de un objetivo mal encastrado o de un usuario con el ajuste
            dióptrico movido. Reproducir la queja con el mismo usuario y la misma muestra.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
