import { SlideLayout, SlideTag, SlideTitle, Crimson, SpecTable, Freq, Panel, Callout, Tool, Figure } from './SlideLayout'

export default function S27_AC_Rutina() {
  const RUTINA: [string, React.ReactNode, string, string][] = [
    [
      'Agua de alimentación',
      <Freq tone="frost">Diaria</Freq>,
      'Nivel y calidad: agua desmineralizada o destilada, nunca de grifo.',
      'Nivel correcto · sin sarro visible en el depósito.',
    ],
    [
      'Empaque de puerta',
      <Freq tone="frost">Diaria</Freq>,
      'Limpiar con paño húmedo y revisar cortes, endurecimiento o deformación.',
      'Elástico, continuo, sin marcas de aplastamiento.',
    ],
    [
      'Drenaje y coladera',
      <Freq tone="frost">Diaria</Freq>,
      'Retirar residuos del filtro de fondo de cámara y verificar que evacúe libre.',
      'Drenaje sin obstrucción.',
    ],
    [
      'Cámara interior',
      <Freq tone="rift">Semanal</Freq>,
      'Limpiar con producto no abrasivo y sin cloro. Enjuagar y secar.',
      'Sin manchas, sin picaduras en el acero.',
    ],
    [
      'Prueba de Bowie‑Dick',
      <Freq tone="rift">Diaria en prevacío</Freq>,
      'Paquete de prueba en cámara vacía, primer ciclo del día.',
      'Viraje uniforme en toda la hoja.',
    ],
    [
      'Válvula de seguridad',
      <Freq tone="amber">Mensual</Freq>,
      'Accionamiento manual con el equipo en presión, según el manual.',
      'Abre y cierra limpio · no gotea después.',
    ],
    [
      'Trampa de vapor y purga',
      <Freq tone="amber">Mensual</Freq>,
      'Verificar evacuación de condensado y funcionamiento de la purga.',
      'Sin acumulación de condensado en cámara.',
    ],
    [
      'Manómetro y sensor',
      <Freq tone="amber">Semestral</Freq>,
      'Comparar contra manómetro y termómetro patrón en el mismo punto.',
      'Dentro de la tolerancia del fabricante.',
    ],
    [
      'Prueba de fuga de vacío',
      <Freq tone="amber">Semestral</Freq>,
      'Ciclo de vacío y medición de la subida de presión en el tiempo.',
      'Dentro del límite declarado, típicamente ≤1,3 mbar/min.',
    ],
    [
      'Resistencias y aislamiento',
      <Freq tone="crimson">Anual</Freq>,
      'Continuidad, resistencia de aislamiento y estado de bornes.',
      'Sin derivación a tierra · bornes sin recalentamiento.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">04 · Esterilizador — rutina</SlideTag>
      <SlideTitle size="md">
        <span>Rutina preventiva: </span>
        <Crimson><span>el agua, el sello y la purga</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', gap: 22, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Punto', 'Frecuencia', 'Procedimiento', 'Criterio de aceptación']}
            cols="142px 96px 1fr 0.9fr"
            rows={RUTINA}
            fontSize={10.3}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Figure
            tone="crimson"
            height={124}
            file="autoclave/empaque-puerta.jpg"
            hint="Empaque de puerta desmontado, con el detalle del labio de sellado."
          />

          <Panel label="Con qué se hace" tone="crimson">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool tone="crimson">Manómetro patrón</Tool>
              <Tool tone="crimson">Datalogger de temperatura</Tool>
              <Tool tone="crimson">Guante térmico</Tool>
              <Tool tone="crimson">Paquete Bowie‑Dick</Tool>
              <Tool tone="crimson">Agua desmineralizada</Tool>
            </div>
          </Panel>

          <Callout kind="crimson" title="Nada de cloro en la cámara">
            El hipoclorito ataca el acero inoxidable por cloruros y deja picaduras que después
            retienen suciedad y arruinan el sellado. Sólo productos aprobados por el fabricante.
          </Callout>

          <Callout kind="amber" title="El agua explica media vida útil">
            Alimentar con agua de grifo incrusta la resistencia, tapa la trampa y sube el tiempo de
            ciclo mes a mes hasta que el equipo ya no llega a temperatura.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
