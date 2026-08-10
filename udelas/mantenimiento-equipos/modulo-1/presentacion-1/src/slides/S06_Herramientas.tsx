import { SlideLayout, SlideTag, SlideTitle, Frost, SpecTable, Panel, Figure, Tool, Callout } from './SlideLayout'

/**
 * El maletín del módulo. Se lista por instrumento y no por equipo
 * porque el mismo tacómetro sirve para varias rutinas: lo que hay que
 * fijar es qué magnitud mide y con qué resolución, que es lo que
 * decide si la medición vale.
 */
export default function S06_Herramientas() {
  const INSTR: [string, string, string, string][] = [
    ['Tacómetro óptico', 'Velocidad · rpm', '1 rpm · hasta 15 000 rpm', 'Centrífuga'],
    ['Cronómetro patrón', 'Tiempo · s', '0,01 s', 'Centrífuga · autoclave · lavador'],
    ['Termómetro patrón + sonda', 'Temperatura · °C', '0,1 °C, trazable', 'Incubadora · autoclave · centrífuga refrigerada'],
    ['Analizador de CO₂', 'Concentración · %', '0,1 % CO₂', 'Incubadora de CO₂'],
    ['Anemómetro de hilo caliente', 'Velocidad de aire · m/s', '0,01 m/s', 'Cámara de flujo laminar'],
    ['Generador de humo', 'Patrón de flujo', 'Visual, sin residuo', 'Cámara de flujo laminar'],
    ['Manómetro patrón', 'Presión · bar / psi', '0,1 bar', 'Esterilizador de vapor'],
    ['Balanza analítica', 'Masa → volumen · mg', '0,1 mg', 'Lavador de ELISA'],
    ['Analizador de seguridad eléctrica', 'Tierra · Ω / fuga · µA', '0,01 Ω · 1 µA', 'Los seis equipos'],
    ['Multímetro y pinza', 'V · Ω · A', 'True RMS', 'Los seis equipos'],
  ]

  return (
    <SlideLayout>
      <SlideTag>Instrumentación</SlideTag>
      <SlideTitle size="md">
        <span>Sin instrumento no hay rutina: </span>
        <Frost><span>con qué se mide cada cosa</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 296px', gap: 24, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Instrumento', 'Magnitud', 'Resolución mínima', 'Dónde se usa']}
            cols="1.15fr 0.95fr 1fr 1.25fr"
            rows={INSTR}
            fontSize={10.8}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure
            tone="frost"
            height={150}
            file="maletin-instrumentos.jpg"
            hint="Foto del maletín con el tacómetro, el anemómetro y el analizador de seguridad."
          />

          <Panel label="Herramienta mecánica" tone="rift">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool tone="rift">Torquímetro</Tool>
              <Tool tone="rift">Llaves Allen</Tool>
              <Tool tone="rift">Pie de rey</Tool>
              <Tool tone="rift">Nivel de burbuja</Tool>
              <Tool tone="rift">Extractor</Tool>
              <Tool tone="rift">Destornilladores aislados</Tool>
            </div>
          </Panel>

          <Panel label="Consumibles" tone="mint">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool tone="mint">Papel de lente</Tool>
              <Tool tone="mint">Detergente pH 6–8</Tool>
              <Tool tone="mint">Alcohol 70 %</Tool>
              <Tool tone="mint">Grasa de rotor</Tool>
              <Tool tone="mint">Empaques</Tool>
              <Tool tone="mint">Indicadores biológicos</Tool>
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Callout kind="amber" title="El instrumento también se calibra">
          Un tacómetro sin certificado vigente no sirve para liberar una centrífuga: la medición
          hereda la trazabilidad del patrón. Verificar la fecha de calibración antes de salir al taller.
        </Callout>
      </div>
    </SlideLayout>
  )
}
