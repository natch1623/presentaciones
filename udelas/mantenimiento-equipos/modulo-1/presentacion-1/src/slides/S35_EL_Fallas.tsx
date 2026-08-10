import { SlideLayout, SlideTag, SlideTitle, Crimson, SpecTable, Panel, Callout, Figure } from './SlideLayout'

export default function S35_EL_Fallas() {
  const FALLAS: [string, string, string][] = [
    [
      'Una columna queda con líquido',
      'Aguja aspiradora obstruida o doblada · manguera de esa vía pinchada',
      'Mirar el canal a contraluz y purgar con jeringa en el sentido del flujo.',
    ],
    [
      'Volumen dispensado bajo en todos los pozos',
      'Tubo peristáltico aplastado · filtro de succión tapado · aire en la línea · buffer bajo',
      'Purgar el aire y verificar el nivel antes de reemplazar el tubo.',
    ],
    [
      'Volumen desigual entre canales',
      'Obstrucción parcial · punta abocardada por alambre inadecuado · válvula sucia',
      'Gravimetría por columnas para aislar el canal.',
    ],
    [
      'No aspira nada',
      'Frasco de residuos lleno · filtro hidrofóbico mojado · tapa mal sellada · sellos de bomba',
      'Vaciar el frasco y revisar el sello de la tapa: cubre casi todos los casos.',
    ],
    [
      'Goteo entre ciclos',
      'Válvula solenoide sucia · efecto sifón por altura del depósito · aguja mal asentada',
      'Limpiar la válvula y verificar la altura relativa del depósito.',
    ],
    [
      'Fondo alto en el ensayo',
      'Residual excesivo · ciclos de lavado insuficientes · buffer mal preparado',
      'Medir el residual antes de culpar al reactivo.',
    ],
    [
      'Las agujas rayan o rompen los pozos',
      'Altura del cabezal · placa mal encajada · carro desalineado',
      'Recalibrar la altura y verificar el encaje de la placa en el portaplacas.',
    ],
    [
      'Cristales blancos en el cabezal',
      'No se purgó al terminar la jornada',
      'Remojar en agua tibia y purgar. No forzar con alambre en seco.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">05 · Lavador de ELISA — diagnóstico</SlideTag>
      <SlideTitle size="md">
        <span>Casi siempre es </span>
        <Crimson><span>una aguja tapada o un frasco lleno</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Síntoma', 'Causa probable — en orden de descarte', 'Primera acción']}
            cols="0.95fr 1.5fr 1.1fr"
            rows={FALLAS}
            fontSize={10.4}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Panel label="Los tres minutos que ahorran la visita" tone="mint">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                'Vaciar el frasco de residuos.',
                'Revisar que la tapa cierre y el filtro esté seco.',
                'Purgar el circuito con agua destilada.',
                'Mirar las agujas a contraluz.',
              ].map((t, i) => (
                <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span className="font-mono" style={{ fontSize: 9.5, color: 'var(--mint)', minWidth: 15 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontSize: 11, color: 'var(--ice-dim)', lineHeight: 1.45, margin: 0 }}>
                    <span>{t}</span>
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Figure
            tone="crimson"
            height={132}
            file="elisa/aguja-obstruida.jpg"
            hint="Comparación entre una aguja limpia y otra con cristales de buffer en la punta."
          />

          <Callout kind="amber" title="Antes de declarar avería">
            Confirmar qué buffer se está usando y desde cuándo. Un buffer vencido o mal filtrado
            tapa canales nuevos a los pocos días de haberlos destapado.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
