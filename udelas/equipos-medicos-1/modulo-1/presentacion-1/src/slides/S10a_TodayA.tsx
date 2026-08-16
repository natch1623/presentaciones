import { At, Ghost, Halo, Icon, Title, Ac, CY, VI, WD, dly } from './Stage'
import iconHibrido from '../assets/icons/s10-01-hibrido.png'
import iconRobotica from '../assets/icons/s10-02-robotica.png'

/**
 * El quirófano de hoy, primera parte. El híbrido manda la escena a
 * escala doble y la robótica entra por abajo a la derecha, más
 * pequeña: dos pesos distintos, no dos tarjetas iguales.
 */
export default function S10a_TodayA() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Híbrido" side="right" size={220} top={-8} opacity={0.026} />
      <Halo x={280} y={470} size={860} color="rgba(0,212,255,0.18)" />
      <Halo x={1150} y={600} size={640} color="rgba(167,139,250,0.16)" />

      <At l={96} t={88} w={900} anim="none">
        <Title size={50} d={0}>
          El quirófano hoy: <Ac>híbrido, integrado, digital</Ac>
        </Title>
      </At>

      {/* El híbrido, a escala de titular */}
      <At l={100} t={228} w={620} d={2}>
        <Icon src={iconHibrido} size={86} color={CY} d={2} />
        <h3
          className="font-display"
          style={{ fontSize: 46, color: CY, margin: '22px 0 18px', lineHeight: 1.05, textShadow: `0 0 44px ${CY}55` }}
        >
          Quirófano Híbrido
        </h3>
        <div
          className="span-x"
          style={{ width: 220, height: 1, background: `linear-gradient(90deg, ${CY}88, transparent)`, marginBottom: 20, ...dly(3) }}
        />
        <p style={{ fontSize: 18.5, color: WD, lineHeight: 1.65, margin: 0, fontWeight: 300, maxWidth: 540 }}>
          Integra equipo quirúrgico e imagen intraoperatoria avanzada (angiógrafo, TC o RM) en la misma sala.
          Opera y verifica antes de cerrar.
        </p>
      </At>

      {/* La robótica, medio escalón abajo y a la derecha */}
      <At l={884} t={318} w={460} d={5}>
        <Icon src={iconRobotica} size={50} color={VI} d={5} />
        <h3
          className="font-display"
          style={{ fontSize: 28, color: VI, margin: '18px 0 14px', lineHeight: 1.1, textShadow: `0 0 30px ${VI}55` }}
        >
          Cirugía Robótica
        </h3>
        <div
          className="span-x"
          style={{ width: 130, height: 1, background: `linear-gradient(90deg, ${VI}88, transparent)`, marginBottom: 16, ...dly(6) }}
        />
        <p style={{ fontSize: 14.5, color: WD, lineHeight: 1.66, margin: 0, fontWeight: 300 }}>
          Intuitive Surgical: 70–80% del mercado, &gt;6,730 sistemas (2021). Nuevos: Hugo RAS (Medtronic) y
          Toumai (MicroPort MedBot, China) — puerto único, primer sistema aprobado para telecirugía comercial.
        </p>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: -40, top: 250, width: 1560, height: 1,
            backgroundImage: `linear-gradient(90deg, transparent, ${CY}33 35%, ${VI}33 70%, transparent)`,
            transform: 'rotate(9deg)', transformOrigin: 'left center', ...dly(4),
          }}
        />
      </At>
    </div>
  )
}
