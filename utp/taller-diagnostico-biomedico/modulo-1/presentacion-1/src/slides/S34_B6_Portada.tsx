import { BlockCover, Hydro, Lunar } from './SlideLayout'

/** Portadilla del Bloque 6 — seguridad eléctrica según IEC 60601‑1. */
export default function S34_B6_Portada() {
  return (
    <BlockCover
      block="Bloque 06"
      clase="Clase 2 · Teoría"
      tone="hydro"
      title={
        <>
          <span>Seguridad eléctrica:</span>
          <br />
          <span>IEC 60601‑1</span>
        </>
      }
      lead={
        <span>
          Todo equipo biomédico se interviene bajo un principio no negociable: primero garantizar la seguridad
          eléctrica. La norma general fija clases de protección, tipos de parte aplicada y límites de corriente de
          fuga.
        </span>
      }
      points={[
        <>
          Fisiología del choque: <Hydro>lo que daña es la corriente</Hydro>, no la tensión
        </>,
        <>Macroshock y microshock: por qué los límites de tipo CF son tan estrictos</>,
        <>Clases de protección, MOP y MOPP, y tipos de parte aplicada</>,
        <>Tierra de protección, corrientes de fuga y condición de primer defecto</>,
        <>
          En la región se complementa con <Lunar>NFPA 99</Lunar> y las guías <Lunar>AAMI</Lunar>
        </>,
      ]}
    />
  )
}
