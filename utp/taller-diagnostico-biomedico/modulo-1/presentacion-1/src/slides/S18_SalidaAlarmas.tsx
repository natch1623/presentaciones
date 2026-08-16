import { SlideLayout, SlideTag, SlideTitle, Glass, Bullet, Hydro, Lunar, Callout, Chip } from './SlideLayout'
import CadenaFuncional from '../components/CadenaFuncional'
import { Moon } from '../components/Celestial'

/**
 * Etapas 5 y 6 más el bloque transversal. Van juntas porque la salida
 * y los actuadores comparten el mismo rasgo —unen electrónica con
 * mecánica, hidráulica o neumática— y porque las alarmas cruzan toda
 * la cadena en lugar de ocupar un lugar en ella.
 */
export default function S18_SalidaAlarmas() {
  const ACTUADORES = [
    'Motor paso a paso · bomba de infusión',
    'Válvulas · ventilador',
    'Elemento calefactor · incubadora',
    'Circuito de descarga · desfibrilador',
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 2 · 2.5 y 2.6</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Salida, actuadores y</span> <Hydro><span>el bloque que vigila todo</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        <Glass tone="hydro" ornament style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Moon size={30} phase="full" tone="hydro" halo={false} />
            <span className="font-display" style={{ fontSize: 22, color: 'var(--moon)' }}>
              <span>Salida, control y actuadores</span>
            </span>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
            <span>
              La salida presenta el resultado —pantalla, indicadores, impresora, audio—. El bloque de control y
              actuadores ejecuta acciones físicas: es donde el equipo hace su terapia.
            </span>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {ACTUADORES.map(a => (
              <Chip key={a} tone="hydro">
                {a}
              </Chip>
            ))}
          </div>

          <div className="orbit-divider" />

          <p style={{ fontSize: 12, color: 'var(--moon-dim)', lineHeight: 1.65, margin: 0 }}>
            <span>
              Por unir electrónica con mecánica, hidráulica o neumática, esta etapa concentra las fallas de
              desgaste.
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Bullet tone="alert">Motor o válvula desgastados.</Bullet>
            <Bullet tone="alert">Calefactor abierto.</Bullet>
            <Bullet tone="alert">Backlight de pantalla agotado.</Bullet>
            <Bullet tone="alert">Relé o driver de potencia dañado.</Bullet>
          </div>
        </Glass>

        <Glass tone="violet" ornament style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Moon size={30} phase="ring" tone="violet" halo={false} />
            <span className="font-display" style={{ fontSize: 22, color: 'var(--moon)' }}>
              <span>Alarmas y seguridad</span>
            </span>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
            <span>
              Bloque transversal: vigila condiciones fuera de rango y protege a paciente y equipo. No ocupa un lugar
              en la cadena porque los cruza todos.
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Bullet tone="violet">Límites de alarma configurables.</Bullet>
            <Bullet tone="violet">
              <Lunar>Watchdog</Lunar>: reinicia el sistema si el firmware se cuelga.
            </Bullet>
            <Bullet tone="violet">Protecciones eléctricas.</Bullet>
          </div>

          <div style={{ flex: 1 }} />

          <Callout kind="alert" title="En equipo de soporte vital">
            Un fallo silencioso de alarma es tan grave como la falla que debía anunciar. Por eso su verificación es
            obligatoria antes de devolver el equipo.
          </Callout>
        </Glass>
      </div>

      <div style={{ height: 88, marginTop: 12, flexShrink: 0 }}>
        <CadenaFuncional activo={5} variant="mini" />
      </div>
    </SlideLayout>
  )
}
