import { SlideLayout, SlideTag, SlideTitle, Rift, SpecTable, Freq, Panel, Callout, Tool, Figure } from './SlideLayout'

export default function S21_FL_Rutina() {
  const RUTINA: [string, React.ReactNode, string, string][] = [
    [
      'Superficie de trabajo',
      <Freq tone="frost">Cada uso</Freq>,
      'Alcohol 70 % antes y después. Encender 15 min antes de trabajar.',
      'Superficie seca, sin material apoyado sobre las rejillas.',
    ],
    [
      'Rejillas de entrada',
      <Freq tone="frost">Cada uso</Freq>,
      'Verificar que ninguna esté bloqueada por papel, gradillas o descartes.',
      'Paso libre en todo el frente.',
    ],
    [
      'Lámpara UV',
      <Freq tone="rift">Semanal</Freq>,
      'Limpiar el tubo con alcohol: el polvo sobre el vidrio recorta la emisión.',
      'Tubo limpio · horas de uso registradas.',
    ],
    [
      'Prefiltro',
      <Freq tone="rift">Mensual</Freq>,
      'Retirar, lavar o reemplazar según el tipo. Secar por completo antes de montar.',
      'Sin polvo visible · sin deformación del marco.',
    ],
    [
      'Presión diferencial',
      <Freq tone="rift">Mensual</Freq>,
      'Leer el manómetro con la cabina en régimen y anotar el valor.',
      'Tendencia estable respecto al valor de instalación.',
    ],
    [
      'Velocidad de aire',
      <Freq tone="amber">Semestral</Freq>,
      'Anemómetro en cuadrícula sobre el plano de trabajo, promedio de nueve puntos.',
      'Dentro de lo declarado, típicamente 0,45 m/s ±20 %.',
    ],
    [
      'Patrón de flujo',
      <Freq tone="amber">Semestral</Freq>,
      'Generador de humo recorriendo el frente y la zona de trabajo.',
      'Flujo unidireccional · sin reflujo hacia el operador.',
    ],
    [
      'Intensidad UV',
      <Freq tone="amber">Semestral</Freq>,
      'Radiómetro UV‑C a la distancia y en los puntos que indique el fabricante.',
      'Sobre el mínimo declarado; si no, reemplazar el tubo.',
    ],
    [
      'Integridad del HEPA',
      <Freq tone="crimson">Anual</Freq>,
      'Aerosol de prueba y fotómetro, barrido del medio filtrante y de todo el sello.',
      'Penetración ≤ 0,01 % · sin fuga en el marco.',
    ],
    [
      'Seguridad eléctrica',
      <Freq tone="crimson">Anual</Freq>,
      'Continuidad de tierra, fuga y estado del cableado de ventilador y balastros.',
      'Dentro de norma.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="rift">03 · Flujo laminar — rutina</SlideTag>
      <SlideTitle size="md">
        <span>Rutina preventiva: </span>
        <Rift><span>lo que se ve y lo que sólo se mide</span></Rift>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 276px', gap: 22, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Punto', 'Frecuencia', 'Procedimiento', 'Criterio de aceptación']}
            cols="140px 88px 1fr 0.92fr"
            rows={RUTINA}
            fontSize={10.4}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Figure
            tone="rift"
            height={128}
            file="flujo-laminar/prefiltro.jpg"
            hint="Prefiltro retirado, con el contraste entre la zona sucia y la limpia."
          />

          <Panel label="Con qué se hace" tone="rift">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool tone="rift">Anemómetro</Tool>
              <Tool tone="rift">Generador de humo</Tool>
              <Tool tone="rift">Radiómetro UV‑C</Tool>
              <Tool tone="rift">Manómetro</Tool>
              <Tool tone="rift">Alcohol 70 %</Tool>
            </div>
          </Panel>

          <Callout kind="crimson" title="El HEPA no se sopla ni se lava">
            Cualquier intento de limpiarlo rompe el medio filtrante y lo deja peor que sucio. Si no
            pasa la prueba de integridad, se reemplaza completo con su sello.
          </Callout>

          <Callout kind="amber" title="El UV no reemplaza la limpieza">
            Sólo actúa sobre superficies expuestas y en línea directa. Lo que quedó debajo de una
            gradilla o cubierto de residuo no se descontamina.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
