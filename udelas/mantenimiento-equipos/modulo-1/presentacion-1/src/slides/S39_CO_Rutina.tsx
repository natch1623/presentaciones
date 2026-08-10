import { SlideLayout, SlideTag, SlideTitle, Frost, SpecTable, Freq, Panel, Callout, Tool, Figure } from './SlideLayout'

export default function S39_CO_Rutina() {
  const RUTINA: [string, React.ReactNode, string, string][] = [
    [
      'Lectura de las tres variables',
      <Freq tone="frost">Diaria</Freq>,
      'Anotar temperatura, %CO₂ y presión del cilindro en la bitácora del equipo.',
      'Dentro de banda · tendencia sin deriva.',
    ],
    [
      'Nivel de la bandeja de agua',
      <Freq tone="frost">Diaria</Freq>,
      'Verificar el nivel y que el agua esté limpia y sin película.',
      'Nivel correcto · agua transparente.',
    ],
    [
      'Cambio de agua',
      <Freq tone="rift">Semanal</Freq>,
      'Vaciar, limpiar la bandeja y reponer con agua destilada estéril.',
      'Bandeja sin biofilm ni depósito.',
    ],
    [
      'Superficies y bandejas',
      <Freq tone="rift">Mensual</Freq>,
      'Retirar bandejas, limpiar con desinfectante compatible y enjuagar.',
      'Sin residuo de medio ni de desinfectante.',
    ],
    [
      'Empaque de puerta',
      <Freq tone="rift">Mensual</Freq>,
      'Limpiar y revisar continuidad; probar con una hoja de papel a lo largo del marco.',
      'El papel ofrece resistencia pareja en todo el perímetro.',
    ],
    [
      'Verificación de CO₂',
      <Freq tone="amber">Trimestral</Freq>,
      'Analizador independiente por el puerto de muestreo, con la cámara estabilizada.',
      'Dentro de la tolerancia del fabricante respecto al ajustado.',
    ],
    [
      'Verificación de temperatura',
      <Freq tone="amber">Trimestral</Freq>,
      'Termómetro patrón en el centro y en las esquinas de la cámara.',
      'Desviación y uniformidad dentro de lo declarado.',
    ],
    [
      'Filtros',
      <Freq tone="amber">Semestral</Freq>,
      'Reemplazar el filtro HEPA interno y el de línea de CO₂ de 0,2 µm.',
      'Reemplazados y fechados · nunca lavados.',
    ],
    [
      'Descontaminación',
      <Freq tone="amber">Semestral</Freq>,
      'Ciclo del equipo o procedimiento manual completo, con la cámara vacía.',
      'Ciclo completado · recalibrar el sensor si es de conductividad térmica.',
    ],
    [
      'Alarmas y seguridad eléctrica',
      <Freq tone="crimson">Anual</Freq>,
      'Provocar cada alarma y verificar continuidad de tierra y fuga.',
      'Todas las alarmas actúan · valores en norma.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="mint">06 · Incubadora de CO₂ — rutina</SlideTag>
      <SlideTitle size="md">
        <span>Rutina preventiva: </span>
        <Frost><span>contra la contaminación y contra la deriva</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', gap: 22, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Punto', 'Frecuencia', 'Procedimiento', 'Criterio de aceptación']}
            cols="158px 92px 1fr 0.92fr"
            rows={RUTINA}
            fontSize={10.3}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Figure
            tone="mint"
            height={124}
            file="incubadora/bandeja-agua.jpg"
            hint="Bandeja de agua retirada, mostrando el depósito o la película que se forma con el tiempo."
          />

          <Panel label="Con qué se hace" tone="mint">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool tone="mint">Analizador de CO₂</Tool>
              <Tool tone="mint">Termómetro patrón</Tool>
              <Tool tone="mint">Agua destilada estéril</Tool>
              <Tool tone="mint">Filtros 0,2 µm</Tool>
              <Tool tone="mint">Solución jabonosa</Tool>
            </div>
          </Panel>

          <Callout kind="crimson" title="La bandeja es el foco">
            Casi toda contaminación del equipo empieza en el agua: hongos que colonizan la bandeja y
            se dispersan con la circulación. Cambiarla semanalmente cuesta menos que perder una
            corrida de cultivo.
          </Callout>

          <Callout kind="amber" title="Después de descontaminar, recalibrar">
            Un sensor de conductividad térmica queda desajustado tras el ciclo de calor y necesita
            12 a 24 horas de estabilización antes de calibrarse. Liberar el equipo antes es liberar
            un valor falso.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
