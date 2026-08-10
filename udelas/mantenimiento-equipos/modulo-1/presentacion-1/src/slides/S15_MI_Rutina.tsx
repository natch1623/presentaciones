import { SlideLayout, SlideTag, SlideTitle, Frost, SpecTable, Freq, Panel, Callout, Step, Tool } from './SlideLayout'

export default function S15_MI_Rutina() {
  const RUTINA: [string, React.ReactNode, string, string][] = [
    [
      'Objetivo de inmersión',
      <Freq tone="frost">Cada jornada</Freq>,
      'Retirar el aceite con papel de lente seco y luego con papel apenas humedecido.',
      'Sin película ni residuo seco en la lente frontal.',
    ],
    [
      'Oculares y lente frontal',
      <Freq tone="rift">Semanal</Freq>,
      'Papel de lente en espiral, del centro al borde, una pasada por hoja.',
      'Campo limpio al girar el ocular.',
    ],
    [
      'Platina y carro X‑Y',
      <Freq tone="rift">Semanal</Freq>,
      'Retirar restos de muestra y aceite; verificar suavidad del desplazamiento.',
      'Sin arrastre ni juego que haga perder el campo.',
    ],
    [
      'Condensador y diafragmas',
      <Freq tone="rift">Mensual</Freq>,
      'Limpiar la lente superior; comprobar que ambos iris abran y cierren parejo.',
      'Iris sin trabas · lente sin huellas.',
    ],
    [
      'Alineación de Köhler',
      <Freq tone="amber">Trimestral</Freq>,
      'Procedimiento completo con objetivo 10× y repetición al cambiar de aumento.',
      'Diafragma de campo nítido y centrado.',
    ],
    [
      'Enfoque coaxial',
      <Freq tone="amber">Trimestral</Freq>,
      'Ajustar la tensión del macrométrico y el tope de seguridad.',
      'No deriva sola · no golpea el porta.',
    ],
    [
      'Lámpara y portalámpara',
      <Freq tone="amber">Semestral</Freq>,
      'Revisar contactos por oxidación; reemplazar sin tocar el vidrio.',
      'Iluminación estable, sin parpadeo.',
    ],
    [
      'Ambiente y guardado',
      <Freq tone="mint">Permanente</Freq>,
      'Funda puesta, sílica gel en el gabinete, humedad relativa controlada.',
      'Sin hongo en la óptica.',
    ],
    [
      'Seguridad eléctrica',
      <Freq tone="crimson">Anual</Freq>,
      'Continuidad de tierra y estado del cordón y del interruptor.',
      'Dentro de norma · cable sin cortes.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag>02 · Microscopio — rutina</SlideTag>
      <SlideTitle size="md">
        <span>Rutina preventiva: </span>
        <Frost><span>casi todo es limpieza bien hecha</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 288px', gap: 22, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Punto', 'Frecuencia', 'Procedimiento', 'Criterio de aceptación']}
            cols="148px 92px 1fr 0.9fr"
            rows={RUTINA}
            fontSize={10.6}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Panel label="Cómo se limpia una lente" tone="frost">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="1" title="Soplar primero">Pera de aire para el polvo suelto: arrastrar una partícula raya el tratamiento.</Step>
              <Step n="2" title="Papel de lente seco">En espiral, del centro al borde. Una pasada por hoja y se descarta.</Step>
              <Step n="3" title="Solvente, si hace falta">Sobre el papel, nunca sobre la lente. Isopropanol o éter‑etanol.</Step>
              <Step n="4" title="Verificar a contraluz">Sin halo ni marca de arrastre antes de volver a montar.</Step>
            </div>
          </Panel>

          <Panel label="Sí se usa" tone="mint">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool tone="mint">Papel de lente</Tool>
              <Tool tone="mint">Pera de aire</Tool>
              <Tool tone="mint">Isopropanol</Tool>
              <Tool tone="mint">Éter‑etanol 7:3</Tool>
              <Tool tone="mint">Hisopo de algodón largo</Tool>
            </div>
          </Panel>

          <Callout kind="crimson" title="No se usa nunca">
            Pañuelo de papel, gasa, algodón común, acetona ni xilol sobre plástico. Rayan el
            tratamiento antirreflejo o disuelven el cemento óptico, y ese daño no se revierte.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
