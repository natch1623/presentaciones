import { SlideLayout, SlideTag, SlideTitle, Rift, SpecTable, Freq, Panel, Callout, Tool, Figure } from './SlideLayout'

export default function S33_EL_Rutina() {
  const RUTINA: [string, React.ReactNode, string, string][] = [
    [
      'Purga final',
      <Freq tone="crimson">Fin de jornada</Freq>,
      'Ciclo completo con agua destilada por todo el circuito, incluidas las agujas.',
      'Sin sal ni buffer retenido en ninguna línea.',
    ],
    [
      'Frasco de residuos',
      <Freq tone="frost">Diaria</Freq>,
      'Vaciar, desinfectar y verificar el sello de la tapa.',
      'Vacío · tapa sellando · filtro seco.',
    ],
    [
      'Inspección del cabezal',
      <Freq tone="frost">Diaria</Freq>,
      'Mirar las agujas a contraluz: cristales, dobladuras, goteo residual.',
      'Agujas rectas, limpias y parejas.',
    ],
    [
      'Ciclo de descontaminación',
      <Freq tone="rift">Semanal</Freq>,
      'Solución recomendada por el fabricante y enjuague abundante posterior.',
      'Sin residuo de desinfectante en el circuito.',
    ],
    [
      'Tubería',
      <Freq tone="rift">Mensual</Freq>,
      'Revisar rigidez, dobleces, fisuras y aplastamiento del tramo peristáltico.',
      'Flexible, sin marcas permanentes.',
    ],
    [
      'Volumen dispensado',
      <Freq tone="amber">Mensual</Freq>,
      'Gravimetría: pesar la placa vacía y llena; 1 mg equivale a 1 µL.',
      'Dentro del ±5 % programado · CV entre pozos ≤5 %.',
    ],
    [
      'Volumen residual',
      <Freq tone="amber">Mensual</Freq>,
      'Llenar, aspirar y pesar de nuevo la placa.',
      'Dentro del máximo declarado por el fabricante.',
    ],
    [
      'Alineación del cabezal',
      <Freq tone="amber">Semestral</Freq>,
      'Verificar centrado sobre los pozos y altura de la aguja aspiradora.',
      'Entra centrada · no toca el fondo ni la pared.',
    ],
    [
      'Bomba y sellos',
      <Freq tone="amber">Semestral</Freq>,
      'Reemplazar el tubo peristáltico; revisar sellos de la bomba de vacío.',
      'Vacío estable durante todo el ciclo.',
    ],
    [
      'Seguridad eléctrica',
      <Freq tone="crimson">Anual</Freq>,
      'Continuidad de tierra y fuga, con especial atención por el manejo de líquidos.',
      'Dentro de norma · sin humedad en el chasis.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="rift">05 · Lavador de ELISA — rutina</SlideTag>
      <SlideTitle size="md">
        <span>Rutina preventiva: </span>
        <Rift><span>todo empieza por purgar</span></Rift>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', gap: 22, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Punto', 'Frecuencia', 'Procedimiento', 'Criterio de aceptación']}
            cols="146px 100px 1fr 0.92fr"
            rows={RUTINA}
            fontSize={10.3}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Figure
            tone="rift"
            height={124}
            file="elisa/agujas-cabezal.jpg"
            hint="Detalle del cabezal a contraluz, mostrando el par de agujas por canal."
          />

          <Panel label="Con qué se hace" tone="rift">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool tone="rift">Balanza analítica</Tool>
              <Tool tone="rift">Agua destilada</Tool>
              <Tool tone="rift">Alambre de limpieza</Tool>
              <Tool tone="rift">Jeringa de purga</Tool>
              <Tool tone="rift">Microplaca de descarte</Tool>
            </div>
          </Panel>

          <Callout kind="crimson" title="Nunca se deja con buffer adentro">
            El PBS cristaliza al secarse. Un fin de semana sin purgar basta para tapar un canal, y
            destapar una aguja de 0,4 mm sin doblarla es mucho más difícil que enjuagar tres minutos.
          </Callout>

          <Callout kind="amber" title="El alambre entra por la punta">
            Sólo el alambre del fabricante y siempre en el sentido del flujo. Un alambre grueso
            abocarda la punta y ese canal ya nunca dispensa igual que los otros.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
