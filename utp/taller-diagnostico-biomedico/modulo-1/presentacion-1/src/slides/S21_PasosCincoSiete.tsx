import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Callout, Bullet } from './SlideLayout'
import OrbitaPasos from '../components/OrbitaPasos'

/**
 * Pasos 5 a 7 y los cuatro errores que rompen el método.
 *
 * Es la diapositiva bisagra del taller: aquí se dice, por primera vez,
 * que reparar no es terminar. Todo el bloque 8 desarrolla esta idea.
 */
export default function S21_PasosCincoSiete() {
  const PASOS = [
    {
      n: 5,
      t: 'Corregir',
      d: 'Reparar o reemplazar el elemento fallado. Antes de intervenir, aplicar las medidas de seguridad eléctrica.',
      clave: 'Buscar y atender la causa raíz, no sólo el síntoma: si un fusible se abrió, averiguar por qué.',
    },
    {
      n: 6,
      t: 'Verificar',
      d: 'Comprobar que la falla desapareció y —crítico en biomédica— que el equipo opera dentro de tolerancia y es seguro.',
      clave: 'Pruebas funcionales con simuladores y analizadores, más pruebas de seguridad eléctrica.',
    },
    {
      n: 7,
      t: 'Documentar',
      d: 'Registrar síntoma, causa raíz, acción, repuestos y resultados de verificación en la orden de trabajo y el historial.',
      clave: 'Lo que se documenta hoy es el paso 2 del próximo diagnóstico.',
    },
  ]

  const ERRORES = [
    <>
      <Lunar>Shotgunning</Lunar>: reemplazar componentes sin aislar la falla.
    </>,
    <>No verificar dentro de tolerancia tras reparar, dejando pasar una falla degradada.</>,
    <>No documentar, perdiendo el historial que aceleraría el próximo diagnóstico.</>,
    <>Intervenir el equipo sin haber comprobado su seguridad eléctrica.</>,
  ]

  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bloque 3 · pasos 5 a 7</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Reparar no es terminar:</span> <Hydro><span>verificar y documentar</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'flex', gap: 26, flex: 1, minHeight: 0 }}>
        <OrbitaPasos total={7} activos={[5, 6, 7]} height={430} tone="hydro" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1, minWidth: 0 }}>
          {PASOS.map((p, i) => (
            <Glass
              key={p.n}
              tone="hydro"
              open
              style={{
                padding: '13px 18px',
                animation: `glideIn 0.75s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.11}s both`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 5 }}>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--hydro)', letterSpacing: '0.1em' }}>
                  <span>{`0${p.n}`}</span>
                </span>
                <span className="font-display" style={{ fontSize: 23, color: 'var(--moon)', lineHeight: 1.1 }}>
                  <span>{p.t}</span>
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 5px' }}>
                <span>{p.d}</span>
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--cyan)', lineHeight: 1.5, margin: 0 }}>
                <span>{p.clave}</span>
              </p>
            </Glass>
          ))}
        </div>

        <Glass tone="ember" style={{ width: 330, display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px' }}>
          <div
            className="font-mono"
            style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ember)', textTransform: 'uppercase' }}
          >
            <span>Errores que rompen el método</span>
          </div>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {ERRORES.map((e, i) => (
              <Bullet key={i} tone="ember">
                {e}
              </Bullet>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <Callout kind="ember" title="El más caro de los cuatro">
            El segundo. Un equipo que enciende pero mide mal vuelve al servicio clínico con la falla intacta.
          </Callout>
        </Glass>
      </div>
    </SlideLayout>
  )
}
