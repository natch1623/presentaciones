import { useState, useEffect, useRef } from 'react'
import React from 'react'
import katex from 'katex'

// ── PALETTE ────────────────────────────────────────────────────────────────
const P = {
  bg: '#080408', bg2: '#120810', card: '#1c0e14',
  red: '#c8192e', rb: '#e8253a', rd: '#6a0d1a',
  rg: 'rgba(200,25,46,0.25)',
  text: '#f0e8e8', muted: '#8a6868', brd: '#3a1820',
} as const

const cf: React.CSSProperties = { fontFamily: "'Cinzel', serif" }
// Chrome (nav bar, badges, block tags) stays on the sans; only the slide body
// moved to the serif, so the UI never competes with the typeset content.
const ui: React.CSSProperties = { fontFamily: "'Inter', sans-serif" }

// ── MATHS ──────────────────────────────────────────────────────────────────
// KaTeX renders once, at module load, when SLIDES is built — roughly thirty
// calls, all synchronous and cheap. `output: 'html'` drops the parallel MathML
// tree: the transition clones each slide up to six times for the fragment
// layers, so halving the node count of every formula is worth more here than
// the screen-reader path on a projected deck.
function tex(src: string, display: boolean): string {
  return katex.renderToString(src, {
    displayMode: display,
    throwOnError: false,
    strict: false,
    output: 'html',
  })
}

/** Inline maths: <M>{String.raw`\mu/\rho`}</M> */
function M({ children }: { children: string }) {
  return <span className="tex" dangerouslySetInnerHTML={{ __html: tex(children, false) }} />
}

/** A quantity: value, thin space, upright unit — and never broken across lines. */
function Q({ v, u }: { v: string | number; u: string }) {
  return <span className="qty">{v}<span className="u">{u}</span></span>
}

// ── MICRO COMPONENTS ───────────────────────────────────────────────────────
function Rd({ children }: { children: React.ReactNode }) {
  return <span style={{ color: P.rb, fontWeight: 700 }}>{children}</span>
}
function Bd({ children }: { children: React.ReactNode }) {
  return <span style={{ fontWeight: 700, color: '#f5ecec' }}>{children}</span>
}
function Ita({ children }: { children: React.ReactNode }) {
  return <span style={{ fontStyle: 'italic', color: '#c0a8a8' }}>{children}</span>
}

/** \subsection — small caps over a hairline, not an uppercase sans label. */
function H2c({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 15, fontWeight: 600, color: P.red,
      marginTop: 13, marginBottom: 6,
      letterSpacing: '0.06em',
      fontVariantCaps: 'all-small-caps',
      borderBottom: `1px solid ${P.brd}`,
      paddingBottom: 3,
    }}>
      {children}
    </h2>
  )
}

/** \item — hanging indent, so wrapped lines align under the text, not the mark. */
function Li({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 5 }}>
      <span style={{ color: P.red, flexShrink: 0, fontSize: 11 }}>•</span>
      <span style={{ color: P.text, lineHeight: 1.5, flex: 1 }}>{children}</span>
    </div>
  )
}

/** Numbered \item: a right-aligned "n." in the margin, LaTeX enumerate style. */
function Ni({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'baseline', marginBottom: 6 }}>
      <span style={{
        minWidth: 20, textAlign: 'right', flexShrink: 0,
        color: P.red, fontSize: 14, fontWeight: 600,
        fontVariantNumeric: 'lining-nums tabular-nums',
      }}>
        {n}.
      </span>
      <span style={{ color: P.text, lineHeight: 1.55, flex: 1, fontSize: 14.5 }}>{children}</span>
    </div>
  )
}

/**
 * Booktabs table: rules only at top, under the head and at the bottom — never
 * between columns, never a zebra fill. Pass `num` with the indices of columns
 * holding figures and they right-align on tabular numerals.
 */
function Tbl({ hs, rs, sm = false, cap, num = [] }: {
  hs: (string | React.ReactNode)[]
  rs: (string | React.ReactNode)[][]
  sm?: boolean
  cap?: string
  num?: number[]
}) {
  return (
    <div style={{ overflowX: 'auto', margin: '10px 0 14px' }}>
      {cap && <div className="tbl-cap">{cap}</div>}
      <table className="booktabs" style={{ fontSize: sm ? 12.5 : 14 }}>
        <thead>
          <tr>
            {hs.map((h, i) => (
              <th key={i} className={num.includes(i) ? 'num' : undefined}
                  style={{ fontSize: sm ? 12 : 13 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rs.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={num.includes(ci) ? 'num' : undefined}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Displayed, numbered equation. `children` is a LaTeX source string; `label`
 * becomes the small-caps caption above it. Numbering is a CSS counter that
 * resets on every slide, so equations read (1), (2), (3) per slide and can be
 * referred to out loud.
 */
function Fml({ children, label }: { children: string; label?: string }) {
  return (
    <div className="eq tex-display">
      {label && <div className="eq-cap">{label}</div>}
      <div className="eq-body" dangerouslySetInnerHTML={{ __html: tex(children, true) }} />
      <div className="eq-tag" />
    </div>
  )
}

/** Unnumbered display maths, for asides that nobody will cite. */
function Fmlx({ children, label }: { children: string; label?: string }) {
  return (
    <div className="eq tex-display" style={{ counterIncrement: 'none' }}>
      {label && <div className="eq-cap">{label}</div>}
      <div className="eq-body" dangerouslySetInnerHTML={{ __html: tex(children, true) }} />
    </div>
  )
}

const NOTE_ENV = {
  n: { cls: 'thm-remark',  head: 'Observación' },
  w: { cls: 'thm-warning', head: 'Advertencia' },
  k: { cls: 'thm-key',     head: 'Ejemplo' },
  c: { cls: '',            head: 'Conclusión' },
} as const

/** \begin{remark} … and friends: rule, small-caps run-in head, no box. */
function Note({ children, type = 'n' }: { children: React.ReactNode; type?: 'n' | 'w' | 'k' | 'c' }) {
  const e = NOTE_ENV[type]
  return (
    <div className={`thm ${e.cls}`} style={{ fontSize: 13.5 }}>
      <span className="thm-head unnumbered">{e.head}</span>
      <span className="thm-body">{children}</span>
    </div>
  )
}

/** \begin{definition} — numbered, so it can be pointed at while presenting. */
function Def({ children, head = 'Definición' }: { children: React.ReactNode; head?: string }) {
  return (
    <div className="thm" style={{ fontSize: 14.5 }}>
      <span className="thm-head">{head}</span>
      <span className="thm-body" style={{ color: P.text }}>{children}</span>
    </div>
  )
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
      <div>{left}</div><div>{right}</div>
    </div>
  )
}

function SW({ block, lam, title, children }: { block?: 'A'|'B'|'C'|'D'; lam?: string; title: string; children: React.ReactNode }) {
  const bl: Record<string,string> = { A:'BLOQUE A · Radiodiagnóstico', B:'BLOQUE B · Radiaciones Ionizantes', C:'BLOQUE C · Tubo de Rayos X', D:'BLOQUE D · Generador de Rayos X' }
  const tLen = title.length
  const tSize = tLen > 52 ? 20 : tLen > 40 ? 24 : tLen > 30 ? 28 : 33
  return (
    <div className="tex-slide" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {block && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, ...ui, fontSize: 10.5, fontWeight: 600, color: '#7a4050', letterSpacing: '0.12em' }}>
          <div style={{ width: 3, height: 14, background: P.rd, borderRadius: 1 }} />
          {bl[block]}{lam ? ` · ${lam}` : ''}
        </div>
      )}
      <h1 style={{ ...cf, fontSize: tSize, fontWeight: 700, color: P.text, lineHeight: 1.2, marginBottom: 18, textShadow: `0 0 40px ${P.rg}` }}>
        {title}
      </h1>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function BDiv({ letter, title, subtitle, themes }: { letter: string; title: string; subtitle: string; themes: string[] }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', minHeight: 'calc(100vh - 110px)' }}>
      <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, ...cf, color: 'rgba(80,8,16,0.22)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em' }}>
        {letter}
      </div>
      <div className="block-in" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ ...cf, fontSize: 12, letterSpacing: '0.32em', color: P.muted, marginBottom: 14 }}>BLOQUE {letter}</div>
        <h1 style={{ ...cf, fontSize: 54, fontWeight: 900, color: P.text, lineHeight: 1.1, marginBottom: 16, textShadow: `0 0 60px ${P.rg}, 0 0 120px rgba(200,25,46,0.1)` }}>{title}</h1>
        <div style={{ width: 80, height: 2, background: P.red, margin: '0 auto 16px', borderRadius: 1 }} />
        <div style={{ ...cf, fontSize: 14, color: P.muted, marginBottom: 26, fontStyle: 'italic' }}>{subtitle}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {themes.map((t, i) => (
            <div key={i} style={{ border: `1px solid ${P.rd}`, borderRadius: 18, padding: '5px 14px', ...cf, fontSize: 11, color: '#b09090', letterSpacing: '0.07em' }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Cover() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 60px', minHeight: 'calc(100vh - 110px)' }}>
      <div style={{ ...cf, fontSize: 11, letterSpacing: '0.32em', color: P.muted, marginBottom: 20 }}>EQUIPOS MÉDICOS III · MÓDULO I · PRESENTACIÓN 1</div>
      <h1 style={{ ...cf, fontSize: 52, fontWeight: 900, color: P.text, lineHeight: 1.1, marginBottom: 20, textShadow: `0 0 80px ${P.rg}` }}>
        EQUIPOS DE<br /><span style={{ color: P.red }}>RADIODIAGNÓSTICO</span>
      </h1>
      <div style={{ width: 100, height: 2, background: `linear-gradient(to right, transparent, ${P.red}, transparent)`, margin: '0 auto 20px' }} />
      <div style={{ fontSize: 17, color: '#b8a0a0', marginBottom: 34, lineHeight: 1.5 }}>Fundamentos, Tubo y Generador de Rayos X</div>
      <div style={{ border: `1px solid ${P.rd}`, borderRadius: 12, padding: '16px 26px', marginBottom: 32, background: 'rgba(20,8,12,0.8)', maxWidth: 660 }}>
        <div style={{ fontSize: 11, color: P.muted, marginBottom: 8, ...cf, letterSpacing: '0.14em' }}>PREGUNTA DE APERTURA</div>
        <div style={{ fontSize: 15, color: '#e0c8c8', fontStyle: 'italic', lineHeight: 1.7 }}>
          "¿Cuál es el único equipo del hospital que produce, de forma deliberada y controlada,
          un agente cancerígeno reconocido — y aun así lo instalamos en cada piso?"
        </div>
      </div>
      <div style={{ display: 'flex', gap: 32, ...cf, fontSize: 12, color: P.muted, letterSpacing: '0.07em' }}>
        <span>Ing. Bryan Rodríguez S.</span>
        <span style={{ color: P.rd }}>·</span>
        <span>UDELAS</span>
        <span style={{ color: P.rd }}>·</span>
        <span>Equipos Médicos III · II Semestre</span>
      </div>
    </div>
  )
}

// ── SLIDES ──────────────────────────────────────────────────────────────────
const SLIDES: Array<{ id: string; block?: string; el: React.ReactElement }> = [

  /* 0 ── PORTADA */
  { id: 'portada', el: <Cover /> },

  /* 1 ── BLOQUE A */
  { id: 'bloque-a', block: 'A', el: <BDiv letter="A" title="El Radiodiagnóstico" subtitle="Tema a" themes={['Definición','Historia','Modalidades','Cadena de imagen','Rol del biomédico']} /> },

  /* 2 ── 1.2 Objetivos */
  { id: '1.2', block: 'A', el: <SW block="A" lam="1.2" title="Objetivos de aprendizaje">
    <Ni n={1}><Bd>Definir</Bd> el radiodiagnóstico como cadena tecnológica y ubicar cada modalidad dentro de ella.</Ni>
    <Ni n={2}><Bd>Explicar</Bd> las propiedades físicas de las radiaciones ionizantes y sus mecanismos de interacción.</Ni>
    <Ni n={3}><Bd>Aplicar</Bd> las ecuaciones fundamentales: inverso del cuadrado, atenuación exponencial, HVL y Duane-Hunt.</Ni>
    <Ni n={4}><Bd>Identificar</Bd> cada componente del tubo de rayos X y justificar su diseño en términos de física y gestión térmica.</Ni>
    <Ni n={5}><Bd>Distinguir</Bd> radiación de frenado (bremsstrahlung) de radiación característica, y predecir cómo kVp, mAs y filtración modifican el espectro.</Ni>
    <Ni n={6}><Bd>Interpretar</Bd> el diagrama de bloques de un generador y relacionar el tipo de rectificación con el rizado, la calidad del haz y la dosis.</Ni>
    <Ni n={7}><Bd>Reconocer</Bd> los modos de operación y las especificaciones que se verifican en aceptación y mantenimiento.</Ni>
    <Note type="k">Los objetivos 3, 5 y 6 son evaluados con <Bd>problemas numéricos</Bd>.</Note>
  </SW> },

  /* 3 ── 1.3 ¿Qué es el radiodiagnóstico? */
  { id: '1.3', block: 'A', el: <SW block="A" lam="1.3" title="¿Qué es el radiodiagnóstico?">
    <Def><Bd>Radiodiagnóstico:</Bd> conjunto de técnicas médicas que utilizan <Rd>rayos X</Rd> para obtener imágenes del interior del cuerpo con fines diagnósticos, sin abrir al paciente.</Def>
    <Note type="k"><Bd>"El rayo X no fotografía el cuerpo: fotografía la sombra que el cuerpo proyecta."</Bd></Note>
    <TwoCol left={<>
      <H2c>Los tres pilares</H2c>
      <Tbl hs={['Pilar','Pregunta que responde','Se controla con']} rs={[
        [<Bd>Producción</Bd>,'¿Cómo genero el haz?','Tubo + generador'],
        [<Bd>Interacción</Bd>,'¿Qué le pasa al haz dentro del paciente?','kVp, filtración, espesor'],
        [<Bd>Detección</Bd>,'¿Cómo convierto el haz remanente en imagen?','Receptor (película, CR, DR, II)'],
      ]} />
    </>} right={<>
      <H2c>Lo que distingue al radiodiagnóstico</H2c>
      <Li><Bd>Usa radiación ionizante</Bd> → hay dosis, hay riesgo, hay normativa.</Li>
      <Li><Bd>Es imagen de transmisión</Bd>, no de reflexión (a diferencia del ultrasonido).</Li>
      <Li><Bd>Es una proyección</Bd>: superpone en 2D toda la anatomía atravesada. La TC nace justamente para resolver esta limitación.</Li>
    </>} />
  </SW> },

  /* 4 ── 1.4 Línea de tiempo */
  { id: '1.4', block: 'A', el: <SW block="A" lam="1.4" title="Línea de tiempo: de Röntgen al detector plano">
    <Tbl sm hs={['Año','Hito','Impacto tecnológico']} rs={[
      [<Bd>8 nov 1895</Bd>,'W.C. Röntgen descubre los rayos X en Würzburg','Nace la imagenología médica'],
      ['22 dic 1895','Radiografía de la mano de Anna Bertha Ludwig','Primera imagen radiográfica de anatomía humana'],
      ['1901','Röntgen: primer Premio Nobel de Física','Reconocimiento científico'],
      [<Rd>1904</Rd>,<Rd>Muere Clarence Dally, asistente de Edison</Rd>,<Rd>Primera víctima documentada por radiación ocupacional</Rd>],
      [<Bd>1913</Bd>,'Coolidge: tubo de cátodo caliente con filamento de tungsteno','Control independiente de kVp y mA — base de todo tubo moderno'],
      ['1913','Bucky y Potter: rejilla antidifusora móvil','Control de la radiación dispersa'],
      [<Bd>1929</Bd>,'Ánodo giratorio','Multiplica la capacidad térmica → exposiciones cortas'],
      ['1948','Coltman: intensificador de imagen','Fluoroscopia con dosis mucho menor'],
      ['1972','Hounsfield: primer tomógrafo (EMI)','Fin de la limitación proyectiva → Módulo II'],
      ['1981','Fuji lanza CR (fósforo fotoestimulable)','Primera imagen digital de proyección'],
      ['1990s','DR — detectores planos de conversión directa e indirecta','Adquisición inmediata, mayor rango dinámico'],
      ['2010–hoy','Detectores de conteo de fotones, reconstrucción con IA','Menos dosis, más información espectral'],
    ]} />
  </SW> },

  /* 5 ── 1.5 El descubrimiento */
  { id: '1.5', block: 'A', el: <SW block="A" lam="1.5" title="El descubrimiento: cómo ocurrió realmente">
    <TwoCol left={<>
      <H2c>La situación</H2c>
      <Li>Röntgen trabajaba con un <Bd>tubo de Crookes</Bd> cubierto con cartón negro, en un cuarto oscuro.</Li>
      <Li>Observó que una pantalla de <Bd>platinocianuro de bario</Bd> a distancia <Bd>fluorescía</Bd>, aunque el tubo estuviera cubierto.</Li>
      <Li>Llamó a la radiación <Rd>"X"</Rd> — la incógnita matemática.</Li>
      <H2c>Lo que determinó en 7 semanas</H2c>
      <Li>Atraviesa materiales opacos a la luz</Li>
      <Li>Es absorbida en proporción a la <Bd>densidad y número atómico</Bd></Li>
      <Li><Bd>No se desvía</Bd> con imanes → no tiene carga</Li>
      <Li><Bd>No se puede enfocar</Bd> con lentes → imagen por proyección cónica</Li>
      <Li>Impresiona placas fotográficas · Produce fluorescencia</Li>
    </>} right={<>
      <Note type="k"><Bd>Röntgen no patentó su descubrimiento.</Bd> En 6 meses, hospitales de todo el mundo tenían equipos funcionando.</Note>
      <div style={{ marginTop: 16, padding: 14, background: '#1a0810', border: `1px solid ${P.rd}`, borderRadius: 8 }}>
        <div style={{ ...cf, fontSize: 11, color: P.red, marginBottom: 7, letterSpacing: '0.1em' }}>CONSECUENCIA FÍSICA</div>
        <div style={{ fontSize: 13, color: '#d0c0c0', lineHeight: 1.6 }}>
          "No se puede enfocar con lentes" define toda la geometría radiográfica: la imagen se forma por <Bd>proyección cónica</Bd> desde un punto focal — de ahí la magnifcación y la penumbra.
        </div>
      </div>
    </>} />
  </SW> },

  /* 6 ── 1.6 Modalidades */
  { id: '1.6', block: 'A', el: <SW block="A" lam="1.6" title="Modalidades del radiodiagnóstico">
    <Tbl hs={['Modalidad','Principio','kVp típico','Aplicación']} rs={[
      [<Bd>Radiografía convencional</Bd>,'Proyección estática','50–125','Tórax, óseo, abdomen'],
      [<Bd>Fluoroscopia</Bd>,'Proyección dinámica en tiempo real','60–120','Gastrointestinal, colocación de catéteres'],
      [<Bd>Arco en C</Bd>,'Fluoroscopia móvil intraoperatoria','40–120','Quirófano, traumatología'],
      [<Bd>Mamografía</Bd>,'Alto contraste en tejido blando',<Rd>22–35</Rd>,'Tamizaje y diagnóstico de mama'],
      [<Bd>Angiografía / Hemodinamia</Bd>,'Fluoroscopia + sustracción digital','60–120','Cardiología intervencionista, neurorradiología'],
      [<Bd>Densitometría ósea (DXA)</Bd>,'Absorciometría de doble energía','2 energías','Osteoporosis'],
      [<Bd>Tomografía computarizada</Bd>,'Proyecciones múltiples + reconstrucción','80–140','→ Módulo II'],
    ]} />
    <Def>Todas comparten la <Bd>misma cadena básica</Bd> (generador → tubo → colimador → paciente → receptor). Cambian la geometría, el receptor y el régimen de trabajo. <Rd>Si dominas la cadena, dominas todas las modalidades.</Rd></Def>
  </SW> },

  /* 7 ── 1.7 Cadena de imagen */
  { id: '1.7', block: 'A', el: <SW block="A" lam="1.7" title="La cadena de imagen radiográfica">
    <TwoCol left={<>
      {[
        { l:'RED ELÉCTRICA', d:'' },
        { l:'GENERADOR', d:'kVp · mA · tiempo' },
        { l:'TUBO RX', d:'99% calor / 1% RX' },
        { l:'FILTRACIÓN', d:'Elimina fotones blandos (≥2.5 mm Al eq)' },
        { l:'COLIMADOR', d:'Limita el campo → menos dosis, menos dispersa' },
        { l:'HAZ PRIMARIO → PACIENTE', d:'ATENUACIÓN DIFERENCIAL → aquí nace la imagen' },
        { l:'REJILLA (Bucky)', d:'Rechaza la dispersa → mejora contraste' },
        { l:'RECEPTOR', d:'Película / CR / DR / intensificador' },
        { l:'PROCESAMIENTO', d:'→ MONITOR → PACS / DICOM' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
          <div style={{ background: item.d ? P.card : P.bg2, border: `1px solid ${item.d ? P.brd : 'transparent'}`, borderRadius: 4, padding: '4px 10px', ...cf, fontSize: 11, fontWeight: 600, color: item.d ? P.text : P.muted, letterSpacing: '0.05em', minWidth: 180, whiteSpace: 'nowrap' }}>
            {item.l}
          </div>
          {item.d && <div style={{ fontSize: 11.5, color: P.muted }}>{item.d}</div>}
        </div>
      ))}
    </>} right={<>
      <Note type="k"><Bd>Regla de oro:</Bd> cada etapa puede degradar la imagen o aumentar la dosis. El diagnóstico de fallas se hace <Bd>recorriendo la cadena en orden</Bd>, no adivinando.</Note>
      <div style={{ marginTop: 16, padding: 14, background: P.card, border: `1px solid ${P.brd}`, borderRadius: 8 }}>
        <div style={{ ...cf, fontSize: 11, color: P.red, marginBottom: 7, letterSpacing: '0.1em' }}>REGLA PRÁCTICA</div>
        <div style={{ fontSize: 13, color: '#c0b0b0', lineHeight: 1.6 }}>
          "Dispara pero no hay imagen" → <Bd>no es el generador</Bd>: el generador disparó. Continuar por la cadena: colimador cerrado, receptor desconectado, procesamiento.
        </div>
      </div>
    </>} />
  </SW> },

  /* 8 ── 1.8 Rol del ingeniero */
  { id: '1.8', block: 'A', el: <SW block="A" lam="1.8" title="El rol del ingeniero biomédico">
    <TwoCol left={<>
      <Tbl sm hs={['Fase','Responsabilidad del biomédico']} rs={[
        [<Bd>Planificación</Bd>,'Especificaciones técnicas, carga de trabajo, requisitos de blindaje'],
        [<Bd>Instalación</Bd>,'Verificación de obra civil, acometida eléctrica, blindaje, tierra'],
        [<Bd>Aceptación</Bd>,'Pruebas de exactitud de kVp, mAs, HVL, alineación haz-luz, fugas'],
        [<Bd>Operación</Bd>,'Control de calidad periódico, registro dosimétrico, capacitación'],
        [<Bd>Mantenimiento</Bd>,'Preventivo (calibración, limpieza) y correctivo (tubo, generador)'],
        [<Bd>Baja</Bd>,'Disposición segura del tubo (plomo y berilio), desmantelamiento del blindaje'],
      ]} />
    </>} right={<>
      <H2c>Tres competencias no negociables</H2c>
      <Ni n={1}><Bd>Sabe medir radiación</Bd> — no confía en el display del equipo, confía en su dosímetro.</Ni>
      <Ni n={2}><Bd>Sabe cuándo apagar un equipo</Bd> — un equipo fuera de tolerancia irradia de más y no diagnostica mejor.</Ni>
      <Ni n={3}><Bd>Entiende que su firma tiene consecuencias sanitarias</Bd> — un kVp descalibrado en 10% × 40 pacientes/día es un problema de salud pública.</Ni>
      <Note type="c">"En quirófano una falla mata rápido. En rayos X una falla mata lento y sin testigos. Por eso el control de calidad no es burocracia: es el único testigo que tenemos."</Note>
    </>} />
  </SW> },

  /* 9 ── BLOQUE B */
  { id: 'bloque-b', block: 'B', el: <BDiv letter="B" title="Radiaciones Ionizantes" subtitle="Tema b" themes={['Espectro EM','Clasificación','10 propiedades','Ley 1/d²','Fotoeléctrico vs Compton','HVL','Dosimetría','Radioprotección']} /> },

  /* 10 ── 2.1 Radiación ionizante */
  { id: '2.1', block: 'B', el: <SW block="B" lam="2.1" title="¿Qué es la radiación ionizante?">
    <Def><Bd>Radiación ionizante:</Bd> cualquier radiación con energía suficiente para <Rd>arrancar un electrón</Rd> de un átomo o molécula, generando un par iónico.</Def>
    <TwoCol left={<>
      <Li>Umbral físico: ~<Bd>13.6 eV</Bd> (hidrógeno) · En la práctica: <Bd>&gt;10–33 eV</Bd></Li>
      <Li>En aire: W ≈ <Bd>33.97 eV</Bd> por par iónico creado → base de toda la dosimetría por cámara de ionización</Li>
      <H2c>Excitación vs. Ionización</H2c>
      <Tbl hs={['Proceso','Qué ocurre','Consecuencia']} rs={[
        [<Bd>Excitación</Bd>,'El electrón sube a nivel superior pero NO abandona el átomo','Emisión de luz/calor al desexcitarse'],
        [<Rd>Ionización</Rd>,'El electrón es EXPULSADO del átomo',<Rd>Ion (+) + electrón libre → daño químico y biológico</Rd>],
      ]} />
    </>} right={<>
      <Note type="k">El daño biológico de los rayos X no proviene del calor. Un fotón de 60 keV puede romper una hebra de ADN porque la energía está <Bd>concentrada en un solo evento</Bd>, no repartida.</Note>
      <div style={{ marginTop: 16, padding: 14, background: P.card, border: `1px solid ${P.brd}`, borderRadius: 8 }}>
        <div style={{ ...cf, fontSize: 11, color: P.red, marginBottom: 8, letterSpacing: '0.1em' }}>IMPLICACIÓN CLÍNICA</div>
        <div style={{ fontSize: 13, color: '#c0b0b0', lineHeight: 1.6 }}>La dosis de rayos X en diagnóstico (µGy – mGy) es termalmente insignificante. El riesgo es estocástico, no térmico.</div>
      </div>
    </>} />
  </SW> },

  /* 11 ── 2.2 Espectro electromagnético */
  { id: '2.2', block: 'B', el: <SW block="B" lam="2.2" title="El espectro electromagnético y la energía del fotón">
    <TwoCol left={<>
      <H2c>Ecuación de Planck-Einstein</H2c>
      <Fml label="Energía del fotón">{String.raw`E = h\nu = \frac{hc}{\lambda}`}</Fml>
      <Fml label="Forma práctica para radiodiagnóstico">{String.raw`E\,[\mathrm{keV}] = \frac{1.24}{\lambda\,[\mathrm{nm}]}`}</Fml>
      <Note type="k">Ejemplo: λ = 0.031 nm → E = 1.24 / 0.031 = <Bd>40 keV</Bd></Note>
    </>} right={<>
      <H2c>Ubicación en el espectro</H2c>
      <Tbl sm hs={['Radiación','Energía/fotón','¿Ioniza?']} rs={[
        ['Radio/microondas','< 10⁻³ eV','No'],
        ['Infrarrojo','0.01–1.6 eV','No'],
        ['Visible','1.6–3.2 eV','No'],
        ['Ultravioleta','3.2–124 eV','UV extremo: sí'],
        [<Rd>Rayos X (diagnóstico)</Rd>,<Rd>20–150 keV</Rd>,<Rd>Sí</Rd>],
        ['Rayos gamma','100 keV – varios MeV','Sí'],
      ]} />
      <Note type="k">Rayos X y γ son <Bd>físicamente idénticos</Bd>. Se distinguen solo por su <Bd>origen</Bd>: X fuera del núcleo (interacción de electrones), γ dentro del núcleo (decaimiento radiactivo).</Note>
    </>} />
  </SW> },

  /* 12 ── 2.3 Clasificación */
  { id: '2.3', block: 'B', el: <SW block="B" lam="2.3" title="Clasificación de las radiaciones ionizantes">
    <Tbl hs={['Tipo','Ejemplo','Carga','Masa','Penetración','Se detiene con']} rs={[
      ['Alfa (α)','²⁴¹Am','+2','4 uma','Muy baja','Hoja de papel / piel'],
      ['Beta (β⁻)','⁹⁰Sr','−1','1/1836 uma','Baja','Pocos mm de aluminio'],
      [<Rd>Rayos X</Rd>,'Tubo de RX','0','0',<Rd>Alta</Rd>,<Rd>cm de plomo/concreto</Rd>],
      ['Gamma (γ)','⁶⁰Co, ⁹⁹ᵐTc','0','0','Muy alta','cm de plomo'],
      ['Neutrones','Reactor','0','1 uma','Muy alta','Hidrogenados (agua, parafina)'],
    ]} />
    <TwoCol left={<>
      <H2c>Clasificación funcional — la que importa</H2c>
      <Li><Bd>Directamente ionizante:</Bd> partículas cargadas (α, β, protones) — ionizan por interacción coulombiana directa</Li>
      <Li><Bd>Indirectamente ionizante:</Bd> fotones (X, γ) y neutrones — primero transfieren energía a un electrón, y <Rd>ese electrón secundario produce la ionización</Rd></Li>
    </>} right={<>
      <Note type="c">Los rayos X son <Bd>indirectamente ionizantes</Bd>. El daño real al ADN lo hacen los <Bd>fotoelectrones y electrones Compton</Bd> que el fotón libera, no el fotón mismo. Este concepto sustenta la definición de KERMA frente a dosis absorbida.</Note>
    </>} />
  </SW> },

  /* 13 ── 2.4 10 propiedades */
  { id: '2.4', block: 'B', el: <SW block="B" lam="2.4" title="Las 10 propiedades de los rayos X">
    <TwoCol left={<>
      <Ni n={1}><Bd>No tienen masa ni carga</Bd> → no se desvían con campos eléctricos ni magnéticos</Ni>
      <Ni n={2}><Bd>Viajan a la velocidad de la luz</Bd> en línea recta</Ni>
      <Ni n={3}><Bd>No se pueden enfocar con lentes</Bd> → imagen por proyección cónica desde el punto focal</Ni>
      <Ni n={4}><Bd>Son altamente penetrantes</Bd> — atraviesan materia opaca a la luz visible</Ni>
      <Ni n={5}><Rd>Son polienergéticos (heterocromáticos)</Rd> — el haz contiene un espectro <Bd>continuo</Bd> de energías, no una sola</Ni>
    </>} right={<>
      <Ni n={6}><Bd>Ionizan la materia</Bd> — base del daño biológico y de toda la dosimetría</Ni>
      <Ni n={7}><Bd>Producen fluorescencia</Bd> en ciertos materiales — base de pantallas y detectores de conversión indirecta</Ni>
      <Ni n={8}><Bd>Producen efecto fotográfico</Bd> — ennegrecen la emulsión de plata</Ni>
      <Ni n={9}><Bd>Producen efectos biológicos</Bd> — determinísticos y estocásticos</Ni>
      <Ni n={10}><Bd>Se dispersan al interactuar</Bd> (Compton) — origen del ruido de la imagen y del riesgo ocupacional</Ni>
    </>} />
    <Note type="k">Detenerse en el #5. <Bd>El haz es un espectro.</Bd> Todo lo que se hace con filtración y kVp es <Ita>darle forma a ese espectro</Ita>.</Note>
  </SW> },

  /* 14 ── 2.5 Ley inverso del cuadrado */
  { id: '2.5', block: 'B', el: <SW block="B" lam="2.5" title="Ley del inverso del cuadrado de la distancia">
    <TwoCol left={<>
      <div style={{ fontSize: 14, color: P.text, lineHeight: 1.6, marginBottom: 10 }}>La intensidad disminuye con el <Bd>cuadrado</Bd> de la distancia porque la misma energía se reparte sobre un área que crece como r².</div>
      <Fml label="Ley del inverso del cuadrado">{String.raw`\frac{I_1}{I_2} = \left(\frac{d_2}{d_1}\right)^{2}`}</Fml>
      <Tbl hs={['Si la distancia...','La intensidad...']} rs={[
        ['se duplica (×2)',<Rd>cae a 1/4 (25%)</Rd>],
        ['se triplica (×3)','cae a 1/9 (11%)'],
        ['se reduce a la mitad',<Rd>aumenta ×4</Rd>],
      ]} />
      <Note type="k">Ejemplo: operador a 1 m recibe 4 mSv/h. Retrocede a 2 m: I₂ = 4 × (1/2)² = <Bd>1 mSv/h</Bd></Note>
    </>} right={<>
      <H2c>Las 3 defensas de la radioprotección</H2c>
      <Tbl hs={['Defensa','Efecto','Costo']} rs={[
        ['Tiempo','Lineal',<span style={{color:'#90e090'}}>Gratis</span>],
        [<Bd>Distancia</Bd>,<Rd>Cuadrático</Rd>,<span style={{color:'#90e090'}}>Gratis</span>],
        ['Blindaje','Exponencial',<span style={{color:'#e09090'}}>Caro</span>],
      ]} />
      <Note type="n">"La distancia es el delantal plomado más barato que existe." Un paso atrás durante una fluoroscopia reduce más la dosis que cualquier accesorio.</Note>
      <H2c>Técnica radiográfica: Regla del 15%</H2c>
      <Li>+15% kVp duplica la densidad de imagen, igual que duplicar el mAs</Li>
      <Li>Uso: subir kVp 15% y reducir mAs a la mitad → misma densidad, <Rd>menor dosis</Rd></Li>
      <Note type="k">Ejemplo: 70 kVp / 20 mAs → 80 kVp / 10 mAs. Misma densidad, menor dosis, algo menos contraste.</Note>
    </>} />
  </SW> },

  /* 15 ── 2.6 5 mecanismos */
  { id: '2.6', block: 'B', el: <SW block="B" lam="2.6" title="Interacción con la materia: los 5 mecanismos">
    <Tbl hs={['Mecanismo','Rango de energía','¿Relevante en RDX?','Efecto en imagen']} rs={[
      ['Dispersión coherente (Rayleigh)','< 10 keV','Marginal (~5%)','Ruido leve'],
      [<Rd>Efecto fotoeléctrico</Rd>,'10–100 keV',<Rd>SÍ — genera CONTRASTE</Rd>,'Señal útil'],
      [<Rd>Efecto Compton</Rd>,'30 keV – 30 MeV',<Rd>SÍ — genera DISPERSA</Rd>,'Ruido + riesgo ocupacional'],
      ['Producción de pares','> 1.022 MeV','NO','—'],
      ['Fotodesintegración','> 10 MeV','NO','—'],
    ]} />
    <Note type="k">En el rango de radiodiagnóstico (20–150 keV) solo importan <Bd>dos</Bd>: el <Rd>fotoeléctrico</Rd> (amigo: hace la imagen) y el <Rd>Compton</Rd> (enemigo: hace el ruido y expone al personal).</Note>
    <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: P.rb, marginTop: 14, padding: '12px', background: '#200810', borderRadius: 8, border: `1px solid ${P.rd}`, ...cf, letterSpacing: '0.05em' }}>
      Fotoeléctrico = imagen &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp; Compton = problema
    </div>
  </SW> },

  /* 16 ── 2.7 Efecto fotoeléctrico */
  { id: '2.7', block: 'B', el: <SW block="B" lam="2.7" title="Efecto fotoeléctrico">
    <TwoCol left={<>
      <H2c>Mecanismo</H2c>
      <Li>El fotón incidente es <Bd>absorbido totalmente</Bd> por un electrón de capa interna (K o L)</Li>
      <Li>El fotoelectrón sale con: <M>{String.raw`E_c = E_{\text{fotón}} - E_{\text{enlace}}`}</M></Li>
      <Li>El hueco se rellena → se emite <Bd>radiación característica secundaria</Bd> (de baja energía, absorbida localmente)</Li>
      <Fml label="Probabilidad de ocurrencia">{String.raw`P_{\text{fotoeléctrico}} \;\propto\; \frac{Z^{3}}{E^{3}}`}</Fml>
    </>} right={<>
      <H2c>Consecuencias directas en imagen</H2c>
      <Tbl sm hs={['Observación','Explicación']} rs={[
        ['El hueso se ve blanco',<>Hueso <M>{String.raw`Z_{\text{ef}} \approx 13.8`}</M> vs tejido blando <M>{String.raw`\approx 7.4`}</M> — el factor <M>{String.raw`Z^{3}`}</M> amplifica la diferencia</>],
        ['Contrastes yodado y baritado funcionan','Z(I)=53, Z(Ba)=56 → absorción fotoeléctrica enorme'],
        [<Rd>Bajar kVp → más contraste</Rd>,'Menor E → mayor probabilidad fotoeléctrica (1/E³)'],
        ['Mamografía usa 22–35 kVp','A baja E el fotoeléctrico distingue tejido glandular de adiposo'],
      ]} />
      <Note type="w"><Bd>Más contraste = más dosis.</Bd> El fotoeléctrico implica absorción total → toda esa energía queda depositada en el paciente.</Note>
    </>} />
  </SW> },

  /* 17 ── 2.8 Efecto Compton */
  { id: '2.8', block: 'B', el: <SW block="B" lam="2.8" title="Efecto Compton">
    <TwoCol left={<>
      <H2c>Mecanismo</H2c>
      <Li>El fotón interactúa con un electrón de <Bd>capa externa</Bd> (débilmente ligado)</Li>
      <Li>Le transfiere <Bd>parte</Bd> de su energía y <Rd>continúa desviado</Rd> con energía menor</Li>
      <Fml label="Corrimiento de Compton">{String.raw`\Delta\lambda = 0.00243\,(1-\cos\theta)\;\mathrm{nm}`}</Fml>
      <Fml label="Probabilidad">{String.raw`P_{\text{Compton}} \;\propto\; \frac{\rho_e}{E} \qquad (\approx \text{independiente de } Z)`}</Fml>
    </>} right={<>
      <H2c>Por qué es un problema</H2c>
      <Tbl sm hs={['Problema','Consecuencia']} rs={[
        ['Fotón desviado puede llegar al receptor',<Rd>Velo: reduce contraste, añade ruido</Rd>],
        ['Sale del paciente en cualquier dirección',<Rd>Riesgo ocupacional</Rd>],
        ['No aporta información anatómica','Señal sin valor diagnóstico'],
      ]} />
      <H2c>Cómo se controla</H2c>
      <Ni n={1}><Bd>Colimación</Bd> — menos volumen irradiado = menos dispersa (la medida más eficaz y más barata)</Ni>
      <Ni n={2}><Bd>Rejilla antidifusora</Bd> (Bucky) — láminas de plomo que solo dejan pasar fotones alineados con el foco</Ni>
      <Ni n={3}><Bd>Air gap</Bd> — distancia objeto-receptor</Ni>
      <Ni n={4}><Bd>Compresión</Bd> — reduce el espesor (mamografía)</Ni>
    </>} />
  </SW> },

  /* 18 ── 2.9 Fotoeléctrico vs Compton */
  { id: '2.9', block: 'B', el: <SW block="B" lam="2.9" title="Fotoeléctrico vs. Compton: la competencia">
    <Tbl hs={['Criterio','Fotoeléctrico','Compton']} rs={[
      ['Fotón incidente','Absorbido totalmente','Desviado, pierde energía parcial'],
      ['Electrón implicado','Capa interna (K, L)','Capa externa'],
      ['Dependencia con Z',<Rd>∝ Z³</Rd>,'Independiente de Z'],
      ['Dependencia con E','∝ 1/E³','∝ 1/E (débil)'],
      ['Contribución imagen',<Rd>Contraste (señal útil)</Rd>,'Velo (ruido)'],
      ['Dosis al paciente','Alta (absorción total)','Menor por evento'],
      ['Riesgo ocupacional','Bajo (absorción local)',<Rd>Alto (radiación dispersa)</Rd>],
    ]} />
    <Note type="k"><Bd>Punto de cruce en tejido blando (<M>{String.raw`Z_{\text{ef}} \approx 7.4`}</M>): ≈ 26–30 keV.</Bd> Por encima de esa energía, <Rd>el Compton domina</Rd>. En tórax a 120 kVp: mayoría son interacciones Compton → bajo contraste inherente → <Bd>por eso se usa rejilla</Bd>.</Note>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
      <div style={{ background: '#200a10', border: `1px solid ${P.rd}`, borderRadius: 8, padding: '10px 14px', textAlign: 'center', fontSize: 13, color: '#d0c0c0' }}>
        <div style={{ color: P.red, fontWeight: 700, marginBottom: 4, ...cf }}>↓ kVp</div>
        <div>más contraste · más dosis al paciente</div>
      </div>
      <div style={{ background: '#200a10', border: `1px solid ${P.rd}`, borderRadius: 8, padding: '10px 14px', textAlign: 'center', fontSize: 13, color: '#d0c0c0' }}>
        <div style={{ color: P.red, fontWeight: 700, marginBottom: 4, ...cf }}>↑ kVp</div>
        <div>menos contraste · menos dosis · más dispersa</div>
      </div>
    </div>
  </SW> },

  /* 19 ── 2.10 Atenuación y HVL */
  { id: '2.10', block: 'B', el: <SW block="B" lam="2.10" title="Atenuación exponencial y capa hemirreductora">
    <TwoCol left={<>
      <Fml label="Ley de atenuación (haz monoenergético)">{String.raw`I = I_0\,e^{-\mu x}`}</Fml>
      <Li><Bd>μ</Bd> = coeficiente de atenuación lineal (cm⁻¹) — depende del material y de la energía</Li>
      <Li><Bd>μ/ρ</Bd> = coeficiente másico (cm²/g) — elimina la dependencia del estado físico</Li>
      <Fml label="Capa hemirreductora (HVL)">{String.raw`\mathrm{HVL} = \frac{\ln 2}{\mu} = \frac{0.693}{\mu}`}</Fml>
      <Fml label="Transmisión tras n capas hemirreductoras">{String.raw`\frac{I}{I_0} = \left(\tfrac{1}{2}\right)^{\!n}`}</Fml>
    </>} right={<>
      <H2c>Tabla de transmisión</H2c>
      <Tbl hs={['n HVL','Transmisión']} rs={[
        ['1','50%'],['2','25%'],['3','12.5%'],['5','3.1%'],['10','0.1%'],
      ]} />
      <H2c>HVL mínima normativa (filtración total)</H2c>
      <Tbl sm hs={['kVp','HVL mínima (mm Al)']} rs={[
        ['70','2.5'],['80','2.9'],['100','3.6'],['120','4.3'],
      ]} />
      <Note type="w">La segunda HVL es siempre mayor que la primera (<Bd>endurecimiento del haz</Bd>). El haz se vuelve progresivamente más penetrante al atravesar materia.</Note>
    </>} />
  </SW> },

  /* 20 ── 2.11 Magnitudes dosimétricas */
  { id: '2.11', block: 'B', el: <SW block="B" lam="2.11" title="Magnitudes y unidades dosimétricas">
    <Tbl hs={['Magnitud','Definición','Unidad SI','Unidad antigua']} rs={[
      [<Bd>Exposición (X)</Bd>,'Carga de ionización en aire por unidad de masa','C/kg','Roentgen (R)'],
      [<Bd>KERMA (K)</Bd>,'Energía cinética transferida a electrones por unidad de masa',<Bd>Gray (Gy) = J/kg</Bd>,'rad'],
      [<Bd>Dosis absorbida (D)</Bd>,'Energía depositada por unidad de masa de tejido',<Bd>Gray (Gy)</Bd>,'rad (1 Gy = 100 rad)'],
      [<Bd>Dosis equivalente (H)</Bd>,'Dosis ponderada por el tipo de radiación',<Bd>Sievert (Sv)</Bd>,'rem (1 Sv = 100 rem)'],
      [<Bd>Dosis efectiva (E)</Bd>,'Dosis ponderada por la radiosensibilidad del órgano',<Bd>Sievert (Sv)</Bd>,'rem'],
    ]} />
    <TwoCol left={<>
      <Fml label="Dosis equivalente">{String.raw`H_T = \sum_{R} w_R \, D_{T,R}`}</Fml>
      <Fml label="Dosis efectiva">{String.raw`E = \sum_{T} w_T \, H_T`}</Fml>
      <div style={{ fontSize: 13, color: P.muted, marginTop: 8 }}>Para rayos X: <M>{String.raw`w_R = 1`}</M></div>
    </>} right={<>
      <Note type="k">Para radiodiagnóstico, <M>{String.raw`w_R = 1`}</M>, por lo tanto numéricamente <Bd>1 Gy = 1 Sv</Bd>. Pero no son la misma magnitud: el Gray mide energía depositada, el Sievert mide riesgo biológico.</Note>
      <H2c>Magnitudes clínicas específicas</H2c>
      <Tbl sm hs={['Símbolo','Uso']} rs={[
        [<Bd>PKA / DAP</Bd>,'Registro de dosis en fluoroscopia e intervencionismo (Gy·cm²)'],
        [<Bd>Ka,r</Bd>,'Estimación de dosis en piel (mGy)'],
        [<Bd>CTDIvol</Bd>,'Índice de dosis en TC → Módulo II'],
      ]} />
    </>} />
  </SW> },

  /* 21 ── 2.12 Efectos biológicos */
  { id: '2.12', block: 'B', el: <SW block="B" lam="2.12" title="Efectos biológicos de la radiación">
    <TwoCol left={<>
      <H2c>Mecanismo del daño</H2c>
      <Li><Bd>Acción directa (~1/3):</Bd> el electrón secundario impacta directamente el ADN</Li>
      <Li><Bd>Acción indirecta (~2/3):</Bd> radiólisis del agua → radicales libres (•OH, H•) → dañan el ADN</Li>
      <Li>Como el cuerpo es ~70% agua, <Rd>el mecanismo indirecto domina</Rd></Li>
      <H2c>Las dos categorías — distinción fundamental</H2c>
      <Tbl sm hs={['','Determinístico','Estocástico']} rs={[
        ['Umbral','Sí existe',<Rd>NO existe (modelo LNT)</Rd>],
        ['Dosis determina','La gravedad','La probabilidad'],
        ['Aparición','Horas a semanas','Años a décadas'],
        ['Ejemplos','Eritema, epilación, cataratas',<Rd>Cáncer, efectos hereditarios</Rd>],
        ['Dónde importa','Fluoroscopia prolongada','Toda exposición, incluso mínima'],
      ]} />
    </>} right={<>
      <H2c>Ley de Bergonié y Tribondeau</H2c>
      <Def>La radiosensibilidad de un tejido es <Bd>mayor</Bd> cuanto más alta su tasa de división celular, menos diferenciadas sus células y más largo su futuro mitótico.</Def>
      <H2c>Orden de radiosensibilidad (de mayor a menor)</H2c>
      <div style={{ fontSize: 13, color: P.text, lineHeight: 1.8, padding: '9px 12px', background: P.card, borderRadius: 6 }}>
        Linfocitos · Médula ósea<br/>
        &gt; Gónadas<br/>
        &gt; Epitelio intestinal &gt; Piel<br/>
        &gt; Tejido conectivo &gt; Hueso &gt; Músculo<br/>
        &gt; <Bd>Nervio</Bd> (el más radiorresistente)
      </div>
      <Note type="k">El niño es <Rd>2 a 3 veces más radiosensible</Rd> que el adulto. La protección pediátrica es una obligación específica, no una cortesía.</Note>
    </>} />
  </SW> },

  /* 22 ── 2.13 Radioprotección */
  { id: '2.13', block: 'B', el: <SW block="B" lam="2.13" title="Principios de protección radiológica (ICRP)">
    <TwoCol left={<>
      <H2c>Los 3 principios del ICRP</H2c>
      <Ni n={1}><Bd>Justificación</Bd> — toda exposición debe producir un beneficio neto. <Ita>Ningún estudio sin indicación clínica.</Ita></Ni>
      <Ni n={2}><Bd>Optimización (ALARA)</Bd> — la dosis tan baja como sea razonablemente posible (<Ita>As Low As Reasonably Achievable</Ita>), considerando factores económicos y sociales.</Ni>
      <Ni n={3}><Bd>Limitación de dosis</Bd> — límites individuales para trabajadores y público (<Ita>no aplican al paciente</Ita>, que se rige por niveles de referencia diagnósticos).</Ni>
      <H2c>Límites de dosis (ICRP 103)</H2c>
      <Tbl sm hs={['Categoría','Cuerpo entero','Cristalino']} rs={[
        [<Bd>Trabajador expuesto</Bd>,'20 mSv/año (prom. 5 años)',<Rd>20 mSv/año</Rd>],
        ['Público general','1 mSv/año','15 mSv/año'],
        ['Embarazada (feto)','1 mSv durante el embarazo declarado','—'],
      ]} />
    </>} right={<>
      <H2c>Dosis efectivas típicas de referencia</H2c>
      <Tbl sm hs={['Estudio','Dosis efectiva','≈ Radiación natural']} rs={[
        ['Rx tórax (PA)','0.02 mSv','~2.4 días'],
        ['Rx columna lumbar','1.5 mSv','~6 meses'],
        ['Mamografía (4 proy.)','0.4 mSv','~7 semanas'],
        [<Rd>TC de abdomen</Rd>,<Rd>8–10 mSv</Rd>,<Rd>~3 años</Rd>],
        [<Bd>Fondo natural</Bd>,'~2.4 mSv/año','—'],
      ]} />
      <Note type="n">"Una TC de abdomen equivale a <Bd>tres años de radiación natural</Bd>" — comunica más que cualquier cifra en mSv.</Note>
    </>} />
  </SW> },

  /* 23 ── 2.14 Cierre Bloque B */
  { id: '2.14', block: 'B', el: <SW block="B" lam="2.14" title="Mapa conceptual — Cierre Bloque B">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 8 }}>
      <div style={{ background: P.rb, borderRadius: 6, padding: '6px 20px', ...cf, fontSize: 13, fontWeight: 700, color: '#fff' }}>RADIACIÓN IONIZANTE</div>
      <div style={{ width: 1, height: 12, background: P.rd }} />
      <div style={{ display: 'flex', gap: 48 }}>
        <div style={{ border: `1px solid ${P.brd}`, borderRadius: 6, padding: '5px 14px', fontSize: 12, color: '#c0b0b0', textAlign: 'center' }}>DIRECTAMENTE<br/><span style={{fontSize:10,color:P.muted}}>(α, β, p)</span></div>
        <div style={{ border: `1px solid ${P.red}`, borderRadius: 6, padding: '5px 14px', fontSize: 12, color: '#e0d0d0', background: '#200810', textAlign: 'center' }}>INDIRECTAMENTE<br/><span style={{fontSize:10,color:P.muted}}>(X, γ, neutrones)</span></div>
      </div>
      <div style={{ width: 1, height: 12, background: P.rd }} />
      <div style={{ border: `1px solid ${P.red}`, borderRadius: 6, padding: '6px 22px', fontSize: 13, color: P.rb, ...cf, fontWeight: 700 }}>RAYOS X (20–150 keV)</div>
      <div style={{ display: 'flex', gap: 40, marginTop: 8 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...cf, fontSize: 11, color: P.muted, marginBottom: 6, letterSpacing:'0.1em' }}>PROPIEDADES</div>
          <Li>Polienergético</Li><Li>No se enfoca</Li><Li><M>{String.raw`1/d^{2}`}</M></Li><Li><M>{String.raw`I = I_0 e^{-\mu x}`}</M></Li>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...cf, fontSize: 11, color: P.muted, marginBottom: 6, letterSpacing:'0.1em' }}>INTERACCIÓN</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: P.rb, fontWeight: 700, fontSize: 13 }}>FOTOELÉCTRICO</div>
              <div style={{ fontSize: 11, color: P.muted }}>∝ Z³/E³<br/>= CONTRASTE</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#e07820', fontWeight: 700, fontSize: 13 }}>COMPTON</div>
              <div style={{ fontSize: 11, color: P.muted }}>∝ ρe/E, ind.Z<br/>= DISPERSA</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...cf, fontSize: 11, color: P.muted, marginBottom: 6, letterSpacing:'0.1em' }}>DOSIS → EFECTOS</div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ fontSize: 12, color: '#c0b0b0' }}>DETERMINÍSTICO<br/><span style={{color:P.muted,fontSize:10}}>(umbral, gravedad)</span></div>
            <div style={{ fontSize: 12, color: P.rb }}>ESTOCÁSTICO<br/><span style={{color:P.muted,fontSize:10}}>(sin umbral, prob.)</span></div>
          </div>
          <div style={{ marginTop: 8, fontSize: 14, color: P.red, fontWeight: 700, ...cf }}>ALARA</div>
        </div>
      </div>
    </div>
  </SW> },

  /* 24 ── BLOQUE C */
  { id: 'bloque-c', block: 'C', el: <BDiv letter="C" title="El Tubo de Rayos X" subtitle="Tema c: componentes y física de la radiación" themes={['Cátodo','Ánodo','Foco lineal','Bremsstrahlung','Radiación característica','Espectro','Carga térmica','Fallas']} /> },

  /* 25 ── 3.1 Tubo de rayos X */
  { id: '3.1', block: 'C', el: <SW block="C" lam="3.1" title="El tubo de rayos X: visión general">
    <Def>El tubo de rayos X es un <Bd>transductor de energía eléctrica a radiación X</Bd> — y es un transductor extremadamente malo: convierte <Rd>menos del 1% en rayos X</Rd> y más del 99% en <Bd>calor</Bd>.</Def>
    <TwoCol left={<>
      <H2c>Los 3 requisitos físicos para producir rayos X</H2c>
      <Ni n={1}>Una <Bd>fuente de electrones</Bd> → cátodo (emisión termoiónica)</Ni>
      <Ni n={2}>Un método para <Bd>acelerarlos a alta velocidad</Bd> → diferencia de potencial (kVp)</Ni>
      <Ni n={3}>Un <Bd>blanco</Bd> donde frenarlos bruscamente → ánodo (tungsteno)</Ni>
      <Note type="n">Todo debe ocurrir en alto vacío (≈10⁻⁷ torr), para que los electrones no choquen con moléculas de gas antes de llegar al ánodo.</Note>
    </>} right={<>
      <H2c>Estructura general</H2c>
      <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#c0b8b8', background: P.card, padding: '12px 16px', borderRadius: 8, border: `1px solid ${P.brd}`, lineHeight: 2.2 }}>
        [CÁTODO −] &nbsp;─e⁻→&nbsp; [ÁNODO +]<br/>
        &nbsp;&nbsp;filamento &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; blanco W<br/>
        &nbsp;&nbsp;copa de enfoque<br/>
        <br/>
        Coraza de plomo<br/>
        Ampolla al vacío<br/>
        Aceite dieléctrico<br/>
        Ventana → <span style={{color:P.rb}}>HAZ ÚTIL</span>
      </div>
    </>} />
  </SW> },

  /* 26 ── 3.2 El cátodo */
  { id: '3.2', block: 'C', el: <SW block="C" lam="3.2" title="El cátodo">
    <TwoCol left={<>
      <H2c>1. Filamento</H2c>
      <Li>Alambre de <Bd>tungsteno toriado</Bd> (1–2% torio), ∼2 mm Ø, enrollado en espiral, 1–2 cm de longitud</Li>
      <Li><Bd>¿Por qué tungsteno?</Bd> Punto de fusión 3422 °C, Z = 74, baja tasa de vaporización</Li>
      <Li><Bd>¿Por qué toriado?</Bd> El torio reduce la función de trabajo → más emisión a menor temperatura → mayor vida útil</Li>
      <Li>Opera a ~2200 °C con corriente de 3–6 A a 10–12 V</Li>
      <H2c>2. Copa de enfoque</H2c>
      <Li>Copa de <Bd>níquel</Bd> cargada negativamente que rodea el filamento</Li>
      <Li>Repele los electrones (−) e impide que el haz se disperse → foco útil</Li>
      <H2c>3. Doble filamento</H2c>
      <Tbl sm hs={['Foco','Tamaño','Uso','Compromiso']} rs={[
        ['Fino','0.3–0.6 mm','Extremidades, mamografía, pediátrico','Poca capacidad térmica'],
        ['Grueso','0.8–1.2 mm','Abdomen, columna, tórax','Menor nitidez'],
      ]} />
    </>} right={<>
      <Fml label="Ecuación de Richardson–Dushman">{String.raw`J = A\,T^{2}\,e^{-W/kT}`}</Fml>
      <Li>La emisión depende <Bd>exponencialmente</Bd> de la temperatura. Un pequeño cambio en la corriente de filamento produce un gran cambio en mA.</Li>
      <Li><Bd>El circuito de filamento debe estar finamente estabilizado.</Bd></Li>
      <Note type="w"><Bd>Falla clásica #1 de fin de vida útil del tubo:</Bd> "El equipo no dispara y muestra error de filamento." El filamento se adelgaza por vaporización con el uso hasta abrirse. No es reparable: <Rd>se cambia el tubo completo.</Rd></Note>
      <Note type="n">Preguntar: "¿Qué pasa si el técnico deja el equipo en prep presionado durante minutos?" → El filamento se mantiene incandescente sin disparar, se vaporiza y <Bd>la vida del tubo cae drásticamente</Bd>.</Note>
    </>} />
  </SW> },

  /* 27 ── 3.3 El ánodo I */
  { id: '3.3', block: 'C', el: <SW block="C" lam="3.3" title="El ánodo (I): función y materiales">
    <TwoCol left={<>
      <H2c>Tres funciones simultáneas</H2c>
      <Ni n={1}><Bd>Blanco</Bd> donde se frenan los electrones y se producen los rayos X</Ni>
      <Ni n={2}><Bd>Conductor eléctrico</Bd> que cierra el circuito de alta tensión</Ni>
      <Ni n={3}><Bd>Disipador térmico</Bd> — la función que más condiciona su diseño</Ni>
      <H2c>¿Por qué tungsteno como blanco?</H2c>
      <Tbl sm hs={['Propiedad','Valor','Por qué importa']} rs={[
        ['Número atómico Z','74','Bremsstrahlung ∝ Z → alto rendimiento'],
        ['Punto de fusión','3422 °C','Soporta el impacto térmico'],
        ['Conductividad térmica','Alta','Evacúa el calor hacia el disco'],
        ['Tasa de vaporización','Baja','Mantiene el vacío'],
      ]} />
    </>} right={<>
      <Li><Bd>Aleación real:</Bd> tungsteno-renio (90/10). El renio da ductilidad y evita el agrietamiento (<Ita>crazing</Ita>) por ciclos térmicos repetidos.</Li>
      <Li><Bd>Substrato del disco:</Bd> molibdeno y/o grafito — más ligeros, mayor capacidad calorífica que el W macizo.</Li>
      <H2c>Excepción — mamografía</H2c>
      <Tbl hs={['Blanco','Z','Radiación característica']} rs={[
        [<Bd>Molibdeno (Mo)</Bd>,'42','17.5 y 19.6 keV'],
        [<Bd>Rodio (Rh)</Bd>,'45','20.2 y 22.7 keV'],
      ]} />
      <Note type="n">En mamografía no se busca penetración, se busca <Bd>contraste entre tejidos blandos</Bd>. Ventana de berilio (Z=4) en lugar de vidrio, porque el vidrio absorbería los fotones de baja energía.</Note>
    </>} />
  </SW> },

  /* 28 ── 3.4 El ánodo II */
  { id: '3.4', block: 'C', el: <SW block="C" lam="3.4" title="El ánodo (II): estacionario vs. giratorio">
    <Tbl hs={['','Estacionario','Giratorio']} rs={[
      ['Construcción','Bloque de W incrustado en cobre','Disco de W-Re/Mo/grafito sobre rotor'],
      ['Área de impacto','Fija — un solo punto',<Rd>Toda la pista circular</Rd>],
      ['Capacidad térmica','Baja',<Rd>Alta (hasta ~100× mayor)</Rd>],
      ['Velocidad de giro','—','3 000 rpm (baja) / 9 000–10 000 rpm (alta)'],
      ['Aplicación','Dental, portátiles pequeños',<Rd>Todo equipo de uso general</Rd>],
    ]} />
    <TwoCol left={<>
      <H2c>Cómo gira sin cables: motor de inducción</H2c>
      <Li>El <Bd>estator</Bd> (bobinas) está <Bd>fuera</Bd> de la ampolla de vidrio</Li>
      <Li>El <Bd>rotor</Bd> (cilindro de cobre + eje de molibdeno) está <Bd>dentro</Bd>, al vacío</Li>
      <Li>El campo magnético rotatorio del estator arrastra el rotor <Rd>sin contacto eléctrico</Rd></Li>
      <Li><Bd>Ganancia térmica:</Bd> factor de 100 a 200 respecto a un blanco estacionario</Li>
    </>} right={<>
      <H2c>Fallas del sistema rotor</H2c>
      <Tbl sm hs={['Síntoma','Causa probable']} rs={[
        ['Zumbido fuerte / vibración','Rodamientos desgastados'],
        ['Error "rotor"','Estator abierto, rotor trabado'],
        ['Frenado anormalmente corto','Rodamiento agarrotado'],
      ]} />
      <Note type="k">Enseñar a <Bd>escuchar el tubo</Bd>. Un rotor que se detiene en 5 s tiene los rodamientos comprometidos — diagnóstico gratuito sin abrir nada.</Note>
    </>} />
  </SW> },

  /* 29 ── 3.5 Foco lineal y efecto anódico */
  { id: '3.5', block: 'C', el: <SW block="C" lam="3.5" title="Foco lineal y efecto anódico">
    <TwoCol left={<>
      <H2c>Principio de foco lineal (line focus)</H2c>
      <Li>La superficie del ánodo está <Bd>inclinada</Bd> un ángulo θ (típicamente 7° a 20°)</Li>
      <Li>Permite: foco <Bd>real</Bd> grande → buena disipación de calor</Li>
      <Li>Y: foco <Bd>efectivo</Bd> pequeño → buena nitidez de imagen</Li>
      <Fml label="Principio de foco lineal">{String.raw`f_{\text{efectivo}} = f_{\text{real}} \times \operatorname{sen}\theta`}</Fml>
      <Note type="k">Foco real <Q v={5} u="mm" />, ángulo 12° → <M>{String.raw`f_{\text{ef}} = 5 \times 0.208 = 1.04`}</M> <Bd>mm</Bd></Note>
      <Tbl sm hs={['Ángulo','Foco efectivo','Cobertura']} rs={[
        ['Pequeño (7–10°)','Más pequeño → más nitidez','Campo limitado'],
        ['Grande (15–20°)','Mayor → menos nitidez','Campo amplio'],
      ]} />
    </>} right={<>
      <H2c>Efecto anódico (heel effect)</H2c>
      <Li>La intensidad del haz <Bd>no es uniforme</Bd> a lo largo del eje cátodo-ánodo</Li>
      <Li>Los fotones emitidos hacia el lado del ánodo son absorbidos por el propio material → <Rd>10% a 45% menos intensidad del lado anódico</Rd></Li>
      <Def><Bd>Regla clínica:</Bd> colocar el <Rd>CÁTODO</Rd> sobre la parte <Bd>MÁS GRUESA o MÁS DENSA</Bd> del paciente.</Def>
      <Tbl sm hs={['Estudio','Lado del cátodo']} rs={[
        ['Columna torácica','Abdomen (más grueso)'],
        ['Fémur','Cadera'],
        ['Mamografía',<Rd>Cátodo hacia la pared torácica</Rd>],
      ]} />
      <Note type="n">El efecto anódico es un <Ita>defecto</Ita> de fabricación que la práctica clínica convirtió en <Bd>herramienta</Bd>.</Note>
    </>} />
  </SW> },

  /* 30 ── 3.6 Coraza y refrigeración */
  { id: '3.6', block: 'C', el: <SW block="C" lam="3.6" title="La coraza y el sistema de refrigeración">
    <TwoCol left={<>
      <H2c>Elementos de la coraza (housing)</H2c>
      <Tbl sm hs={['Elemento','Función']} rs={[
        [<Bd>Blindaje de plomo</Bd>,<>Absorbe fuga. Límite: <Rd>≤ 1 mGy/h a 1 m</Rd></>],
        [<Bd>Aceite dieléctrico</Bd>,'Aislante eléctrico (soporta 150 kV) + transferencia térmica'],
        [<Bd>Fuelle de expansión</Bd>,'Absorbe dilatación del aceite; microswitch corta el disparo si supera el límite térmico'],
        [<Bd>Ventana/puerto</Bd>,'Zona adelgazada por donde sale el haz útil'],
        [<Bd>Filtración inherente</Bd>,'Vidrio + aceite + ventana ≈ 0.5–1.0 mm Al eq'],
      ]} />
      <H2c>Cadena de disipación térmica</H2c>
      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#c0b8b8', background: P.card, padding: '10px 14px', borderRadius: 6, lineHeight: 1.9 }}>
        Foco (2600°C) → disco del ánodo →<br/>
        radiación al vacío → ampolla →<br/>
        conducción → aceite → convección →<br/>
        coraza → aire ambiente (o chiller)
      </div>
    </>} right={<>
      <H2c>Niveles de refrigeración</H2c>
      <Tbl sm hs={['Nivel','Sistema','Aplicación']} rs={[
        ['1','Convección natural del aceite','Radiografía de bajo volumen'],
        ['2','Ventilador forzado sobre la coraza','Sala de alto tránsito'],
        ['3','Intercambiador aceite-aire con bomba','Fluoroscopia, angiografía'],
        ['4','Intercambiador aceite-agua (chiller)','TC, hemodinamia'],
      ]} />
      <Note type="w">
        <Bd>Fallas de refrigeración:</Bd><br/>
        Fuga de aceite → arco eléctrico interno → tubo destruido<br/>
        Ventilador detenido → bloqueo térmico frecuente<br/>
        Filtro del intercambiador sucio → misma consecuencia
      </Note>
      <Note type="n">"Si el usuario reporta que el equipo 'se bloquea después de 20 estudios', el problema casi nunca es electrónico: es térmico. Empiece por el ventilador y el intercambiador."</Note>
    </>} />
  </SW> },

  /* 31 ── 3.7 Bremsstrahlung */
  { id: '3.7', block: 'C', el: <SW block="C" lam="3.7" title="Física de la producción (I): Bremsstrahlung">
    <TwoCol left={<>
      <Def>Del alemán: <Ita>bremsen</Ita> (frenar) + <Ita>Strahlung</Ita> (radiación). El electrón pasa cerca del núcleo de W; la atracción coulombiana lo desvía y frena. La energía cinética perdida se emite como un <Rd>fotón de rayos X</Rd>.</Def>
      <Li><Bd>Característica esencial:</Bd> la energía perdida depende de cuán cerca pase del núcleo — <Rd>eso es aleatorio</Rd></Li>
      <Note type="k"><Bd>El bremsstrahlung produce un ESPECTRO CONTINUO</Bd>, con fotones de todas las energías desde casi 0 hasta un máximo definido por el kVp.</Note>
      <Li>Contribución al haz: aproximadamente el <Bd>80–90%</Bd> del haz total</Li>
    </>} right={<>
      <H2c>El límite superior — Ley de Duane-Hunt</H2c>
      <Li>El fotón de máxima energía se produce cuando un electrón cede <Bd>toda</Bd> su energía cinética en una sola interacción</Li>
      <Fml label="Energía máxima del fotón">{String.raw`E_{\max}\,[\mathrm{keV}] = \mathrm{kVp}`}</Fml>
      <Fml label="Longitud de onda mínima">{String.raw`\lambda_{\min}\,[\mathrm{nm}] = \frac{1.24}{\mathrm{kVp}\,[\mathrm{kV}]}`}</Fml>
      <Note type="k">Ejemplo: con 100 kVp, ningún fotón puede superar 100 keV, y λ_mín = 1.24/100 = <Bd>0.0124 nm</Bd></Note>
      <Note type="n"><Bd>kVp fija el techo, no la media.</Bd> La energía media del haz es aproximadamente <Rd>1/3 a 1/2 del kVp</Rd> (depende de la filtración).</Note>
    </>} />
  </SW> },

  /* 32 ── 3.8 Radiación característica */
  { id: '3.8', block: 'C', el: <SW block="C" lam="3.8" title="Física de la producción (II): radiación característica">
    <TwoCol left={<>
      <H2c>Mecanismo (4 pasos)</H2c>
      <Ni n={1}>El electrón incidente expulsa un electrón de capa interna (K, L) del tungsteno</Ni>
      <Ni n={2}>Queda una <Bd>vacante</Bd> — el átomo está en estado excitado</Ni>
      <Ni n={3}>Un electrón de capa superior <Bd>cae</Bd> para llenar la vacante</Ni>
      <Ni n={4}>La diferencia exacta de energías de enlace se emite como un <Rd>fotón de energía discreta</Rd></Ni>
      <Note type="k"><Bd>La radiación característica produce LÍNEAS DISCRETAS</Bd> en el espectro — su energía identifica el material del blanco.</Note>
      <Note type="c"><Bd>Condición crítica:</Bd> <Rd>No hay radiación característica K si kVp &lt; 69.5 kV</Rd> (energía de enlace de la capa K del W).</Note>
    </>} right={<>
      <H2c>Energías del tungsteno (Z = 74)</H2c>
      <Tbl hs={['Capa','Energía de enlace']} rs={[
        [<Bd>K</Bd>,<Rd>69.5 keV</Rd>],
        ['L','10.2 – 12.1 keV'],
        ['M','~2.5 keV'],
      ]} />
      <H2c>Líneas características K del W</H2c>
      <Tbl hs={['Transición','Energía del fotón']} rs={[
        [<Bd>K-α (L → K)</Bd>,<Rd>≈ 59.3 keV</Rd>],
        [<Bd>K-β (M → K)</Bd>,<Rd>≈ 67.2 keV</Rd>],
      ]} />
      <Li>Contribución: 0% (por debajo de 69.5 kVp) hasta <Bd>10–28%</Bd> a 100–150 kVp</Li>
    </>} />
  </SW> },

  /* 33 ── 3.9 Espectro de emisión */
  { id: '3.9', block: 'C', el: <SW block="C" lam="3.9" title="El espectro de emisión: anatomía de una curva">
    <TwoCol left={<>
      <H2c>Cómo leer un espectro — 5 puntos de referencia</H2c>
      <Tbl hs={['Punto','Qué indica','Depende de']} rs={[
        [<Bd>Extremo derecho (<M>{String.raw`E_{\max}`}</M>)</Bd>,'Corte de Duane–Hunt',<Rd>kVp exclusivamente</Rd>],
        [<Bd>Extremo izquierdo</Bd>,'Corte por filtración','Filtración total'],
        [<Bd>Altura de la curva</Bd>,'Cantidad de fotones','mAs, kVp², Z'],
        [<Rd>Picos discretos</Rd>,'Radiación característica',<Rd>Material del blanco</Rd>],
        [<Bd>Área bajo la curva</Bd>,'Intensidad total del haz','Todos los anteriores'],
      ]} />
    </>} right={<>
      <H2c>Regla de las 3 preguntas para analizar cualquier espectro</H2c>
      <Ni n={1}>¿Dónde termina a la derecha? → me dice el <Rd>kVp</Rd></Ni>
      <Ni n={2}>¿Hay picos y dónde? → me dice el <Rd>material del blanco</Rd> (y si kVp &gt; 69.5)</Ni>
      <Ni n={3}>¿Cuánta área hay? → me dice la <Rd>intensidad (dosis)</Rd></Ni>
      <Note type="k">Dibujar el espectro a mano en la pizarra tres veces: base, con +kVp y con +filtración. Es el ejercicio que más rendimiento da en el examen.</Note>
      <div style={{ marginTop: 12, padding: '10px 14px', background: P.card, border: `1px solid ${P.brd}`, borderRadius: 8, fontFamily: 'monospace', fontSize: 11.5, color: '#c0b0b0', lineHeight: 1.9 }}>
        I ↑<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:P.rb}}>│╭─K-β(67.2)─╮</span><br/>
        &nbsp;&nbsp;&nbsp;&nbsp;│<span style={{color:P.red}}>╭K-α(59.3)╮</span>&nbsp;│<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;│<br/>
        ────┴─────────────┴──→ E [keV] → <span style={{color:P.rb}}>kVp</span>
      </div>
    </>} />
  </SW> },

  /* 34 ── 3.10 Factores que modifican el espectro */
  { id: '3.10', block: 'C', el: <SW block="C" lam="3.10" title="Factores que modifican el espectro">
    <Tbl hs={['Factor','Efecto en área (cantidad)','Efecto en energía (calidad)','Relación']} rs={[
      [<Bd>mAs</Bd>,'↑ proporcional','Sin cambio','Lineal: I ∝ mAs'],
      [<Rd>kVp</Rd>,<Rd>↑↑ muy fuerte</Rd>,<Rd>↑ más penetrante</Rd>,<Rd>I ∝ kVp²</Rd>],
      [<Bd>Filtración</Bd>,'↓','↑ (endurece el haz)','Exponencial'],
      [<Bd>Material del blanco (Z)</Bd>,'↑','↑ (posición de los picos)','I ∝ Z'],
      [<Bd>Distancia</Bd>,'↓','Sin cambio','1/d²'],
    ]} />
    <H2c>Las relaciones que hay que memorizar</H2c>
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', margin: '10px 0' }}>
      {['I ∝ mAs','I ∝ kVp²','I ∝ Z','I ∝ 1/d²'].map(f => (
        <div key={f} className="pulse-glow" style={{ background: P.card, border: `1px solid ${P.red}`, borderRadius: 8, padding: '7px 20px', fontFamily: 'monospace', fontSize: 18, color: P.rb }}>
          {f}
        </div>
      ))}
    </div>
    <Note type="k"><Bd>Eficiencia de producción:</Bd> η ≈ 1.1×10⁻⁹ × Z × V. Para W a 100 kVp: η ≈ 0.8%. <Rd>Menos del 1% de la energía se convierte en rayos X. El resto — más del 99% — es calor.</Rd> Esta cifra explica todo el diseño térmico del tubo.</Note>
  </SW> },

  /* 35 ── 3.11 Filtración */
  { id: '3.11', block: 'C', el: <SW block="C" lam="3.11" title="Filtración">
    <TwoCol left={<>
      <Def><Bd>Objetivo:</Bd> eliminar los fotones de baja energía que no atraviesan al paciente y por lo tanto no contribuyen a la imagen, <Rd>solo a la dosis en piel</Rd>.</Def>
      <Tbl hs={['Tipo','Origen','Valor típico']} rs={[
        [<Bd>Inherente</Bd>,'Vidrio de la ampolla, aceite, ventana','0.5–1.0 mm Al eq'],
        [<Bd>Añadida</Bd>,'Láminas de Al (y cobre) en el colimador','1.5–2.0 mm Al eq'],
        [<Rd>Total</Rd>,'Suma de ambas',<Rd>≥ 2.5 mm Al eq (kVp &gt; 70)</Rd>],
      ]} />
      <H2c>Requisitos normativos de filtración mínima</H2c>
      <Tbl sm hs={['Rango kVp','Filtración mínima']} rs={[
        ['< 50 kVp','0.5 mm Al eq'],
        ['50–70 kVp','1.5 mm Al eq'],
        [<Rd>&gt; 70 kVp</Rd>,<Rd>2.5 mm Al eq</Rd>],
      ]} />
    </>} right={<>
      <H2c>Efectos de aumentar la filtración</H2c>
      <Tbl hs={['Parámetro','Efecto']} rs={[
        ['Energía media del haz',<Rd>↑ (endurecimiento)</Rd>],
        ['HVL','↑'],
        ['Intensidad total','↓'],
        [<Rd>Dosis en piel del paciente</Rd>,<Rd>↓↓ (el objetivo)</Rd>],
        ['Contraste de la imagen','↓ ligeramente'],
      ]} />
      <Note type="k">La filtración no se mide directamente: <Bd>se mide la HVL</Bd> con láminas de Al calibradas y una cámara de ionización. Si la HVL está por debajo del mínimo normativo, el equipo <Rd>no puede usarse clínicamente</Rd>.</Note>
      <Note type="n">"Un filtro faltante o mal colocado no da error en pantalla. La imagen se ve bien. Solo el dosímetro lo detecta. Por eso la prueba de HVL es obligatoria en aceptación y anualmente."</Note>
    </>} />
  </SW> },

  /* 36 ── 3.12 Carga térmica */
  { id: '3.12', block: 'C', el: <SW block="C" lam="3.12" title="Carga térmica y curvas de clasificación">
    <TwoCol left={<>
      <Fml label="Unidades de calor (HU)">{String.raw`\mathrm{HU} = \mathrm{kVp} \times \mathrm{mA} \times s \times f`}</Fml>
      <H2c>Factor de forma de onda (f)</H2c>
      <Tbl sm hs={['Tipo de generador','Factor f']} rs={[
        ['Monofásico','1.00'],
        ['Trifásico 6 pulsos','1.35'],
        [<Rd>Trifásico 12 pulsos / Alta frecuencia</Rd>,<Rd>1.41</Rd>],
      ]} />
      <Note type="k">Ejemplo: 80 kVp, 200 mA, 0.5 s, alta frecuencia:<br/>HU = 80 × 200 × 0.5 × 1.41 = <Bd>11 280 HU</Bd> (≈ 8.0 kJ)</Note>
    </>} right={<>
      <H2c>Los 3 límites térmicos del tubo</H2c>
      <Tbl hs={['Límite','Protege','Magnitud típica']} rs={[
        [<Bd>Carga del foco (por exposición)</Bd>,'El punto focal — evita fundir la pista del ánodo','Curva de clasificación (rating chart)'],
        [<Bd>Cap. calorífica del ánodo</Bd>,'El disco completo — serie de exposiciones','300 kHU – 5 MHU'],
        [<Bd>Cap. calorífica de la coraza</Bd>,'Aceite y carcasa — jornada completa','1 – 5 MHU'],
      ]} />
      <Note type="w">Si el usuario reporta "el equipo no dispara y aparece un símbolo de termómetro", <Bd>no es una falla: es la protección funcionando.</Bd> Verificar el sistema de refrigeración y la carga de trabajo real.</Note>
    </>} />
  </SW> },

  /* 37 ── 3.13 Fallas del tubo */
  { id: '3.13', block: 'C', el: <SW block="C" lam="3.13" title="Fallas del tubo de rayos X">
    <Tbl sm hs={['Falla','Síntoma','Causa','Acción']} rs={[
      [<Bd>Filamento abierto</Bd>,'No dispara, error de filamento, no hay mA','Vaporización / prep prolongado',<Rd>Reemplazo del tubo</Rd>],
      [<Bd>Vaporización de tungsteno</Bd>,'Disparos erráticos, kVp inestable','W depositado en el vidrio altera el campo',<Rd>Reemplazo del tubo</Rd>],
      [<Bd>Agrietamiento del ánodo (crazing)</Bd>,'Caída progresiva de la salida','Choque térmico, calentamiento inadecuado',<Rd>Reemplazo del tubo</Rd>],
      [<Bd>Rotor dañado</Bd>,'Zumbido, vibración, error de rotor','Rodamientos desgastados',<Rd>Reemplazo del tubo</Rd>],
      [<Bd>Fuga de aceite</Bd>,'Manchas, arco interno, olor','Sello o fuelle deteriorado',<Rd>Reemplazo del tubo</Rd>],
      [<Bd>Pérdida de vacío</Bd>,'Sobrecorriente, no alcanza el kVp','Microfisura en la ampolla',<Rd>Reemplazo del tubo</Rd>],
    ]} />
    <Note type="c">Casi todas las fallas terminan en <Bd>reemplazo completo</Bd>. El tubo es un <Bd>consumible de alto costo</Bd>, no un componente reparable en campo.</Note>
    <H2c>Buenas prácticas que extienden la vida del tubo</H2c>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
      <div>
        <Ni n={1}><Bd>Calentamiento (warm-up)</Bd> al inicio de la jornada según protocolo — evita el choque térmico sobre un ánodo frío</Ni>
        <Ni n={2}><Bd>No mantener el prep presionado</Bd> más allá de lo necesario</Ni>
      </div>
      <div>
        <Ni n={3}><Bd>Respetar los tiempos de enfriamiento</Bd> entre series</Ni>
        <Ni n={4}><Bd>Usar el foco grueso</Bd> cuando la técnica lo permita</Ni>
      </div>
    </div>
    <Note type="k">"El calentamiento de 3 minutos que el técnico se salta cada mañana es la diferencia entre 4 años y 2 años de vida útil del tubo. Ese hábito es dinero, y el biomédico es quien tiene que defenderlo."</Note>
  </SW> },

  /* 38 ── BLOQUE D */
  { id: 'bloque-d', block: 'D', el: <BDiv letter="D" title="Generador de Rayos X" subtitle="Tema d: diagrama de bloques, modos de operación, especificaciones" themes={['Diagrama de bloques','Rizado','Alta frecuencia','Modos de operación','AEC','Fluoroscopia','Especificaciones','Control de calidad']} /> },

  /* 39 ── 4.1 ¿Qué hace el generador? */
  { id: '4.1', block: 'D', el: <SW block="D" lam="4.1" title="¿Qué hace un generador de rayos X?">
    <Def>El generador convierte la energía de la red eléctrica en la <Rd>alta tensión continua, estable y precisamente controlada</Rd> que el tubo necesita — y permite al operador definir los tres parámetros de la exposición.</Def>
    <TwoCol left={<>
      <Tbl hs={['Parámetro','Qué controla físicamente','Qué determina en imagen']} rs={[
        [<Bd>kVp</Bd>,'Energía de aceleración de los electrones',<Rd>Calidad (penetración) y contraste</Rd>],
        [<Bd>mA</Bd>,'Cantidad de electrones por segundo','Cantidad de fotones (por unidad de tiempo)'],
        [<Bd>s (tiempo)</Bd>,'Duración del disparo','Cantidad total + control del movimiento'],
      ]} />
      <Note type="k"><Bd>mA × s = mAs</Bd> — la magnitud que realmente importa: define la cantidad total de radiación.</Note>
    </>} right={<>
      <H2c>El problema técnico que resuelve el generador</H2c>
      <Tbl sm hs={['Necesidad','Magnitud']} rs={[
        ['Tensión de red disponible','220/380/480 V AC'],
        [<Bd>Tensión requerida por el tubo</Bd>,<Rd>40 000–150 000 V DC</Rd>],
        ['Factor de elevación','× 300 a × 1000'],
        ['Estabilidad exigida','±5% en kVp, ±10% en mAs'],
        ['Tiempo de respuesta','Exposiciones de 1 ms'],
      ]} />
      <Note type="n">"El tubo produce los rayos X, pero el generador decide cómo son. El 70% de los problemas de calidad de imagen que parecen del tubo son del generador."</Note>
    </>} />
  </SW> },

  /* 40 ── 4.2 Diagrama de bloques */
  { id: '4.2', block: 'D', el: <SW block="D" lam="4.2" title="Diagrama de bloques del generador">
    <TwoCol left={<>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { l:'RED ELÉCTRICA', d:'220/380/480 V AC', hl:false },
          { l:'COMPENSADOR DE LÍNEA', d:'Corrige variaciones de la línea', hl:false },
          { l:'AUTOTRANSFORMADOR', d:'← SELECTOR DE kVp (toma variable)', hl:false },
          { l:'TEMPORIZADOR / CONTACTOR', d:'Control del tiempo de exposición', hl:false },
          { l:'TRANSFORMADOR DE ALTA TENSIÓN', d:'Relación ~1000:1, sumergido en aceite', hl:false },
          { l:'RECTIFICADOR', d:'AC → DC (puente de diodos)', hl:false },
          { l:'TUBO DE RAYOS X', d:'Ánodo (+) · Cátodo (−)', hl:true },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ background: item.hl ? P.red : P.card, border: `1px solid ${item.hl ? P.rb : P.brd}`, borderRadius: 4, padding: '4px 10px', ...cf, fontSize: 10.5, fontWeight: 600, color: item.hl ? '#fff' : P.text, minWidth: 170, letterSpacing: '0.04em' }}>
              {item.l}
            </div>
            <div style={{ fontSize: 11, color: P.muted }}>{item.d}</div>
          </div>
        ))}
      </div>
    </>} right={<>
      <div style={{ padding: 12, background: '#1a0810', border: `1px solid ${P.rd}`, borderRadius: 6, marginBottom: 12 }}>
        <div style={{ ...cf, fontSize: 11, color: P.red, marginBottom: 6, letterSpacing: '0.1em' }}>CIRCUITO DE FILAMENTO</div>
        <Li><Bd>Transformador reductor</Bd> (a ~10–12 V) + estabilizador</Li>
        <Li>Es el <Bd>selector de mA</Bd></Li>
      </div>
      <div style={{ padding: 12, background: '#1a0810', border: `1px solid ${P.rd}`, borderRadius: 6, marginBottom: 12 }}>
        <div style={{ ...cf, fontSize: 11, color: P.red, marginBottom: 6, letterSpacing: '0.1em' }}>CIRCUITO DE ROTOR</div>
        <Li>Alimenta el estator — arranque y frenado dinámico del ánodo giratorio</Li>
      </div>
      <Note type="k"><Bd>Separación fundamental:</Bd> el circuito de alta tensión controla el <Rd>kVp</Rd>; el de filamento controla el <Rd>mA</Rd>. Son independientes — eso es el aporte del tubo Coolidge de 1913.</Note>
    </>} />
  </SW> },

  /* 41 ── 4.3 Los bloques uno por uno */
  { id: '4.3', block: 'D', el: <SW block="D" lam="4.3" title="Los bloques del generador, uno por uno">
    <TwoCol left={<>
      <H2c>1. Autotransformador</H2c>
      <Li>Transformador de <Bd>un solo devanado</Bd> con múltiples tomas — es el <Bd>selector de kVp</Bd>. Ajusta finamente la tensión entregada al primario.</Li>
      <H2c>2. Transformador de alta tensión</H2c>
      <Li>Relación <Bd>500:1 a 1000:1</Bd>, sumergido en aceite dieléctrico</Li>
      <Li>Punto medio del secundario a tierra → ánodo a +75 kV y cátodo a −75 kV; ningún punto supera 75 kV respecto a tierra</Li>
      <H2c>3. Rectificador</H2c>
      <Li>Convierte la AC del secundario en DC pulsante. <Bd>Puente de diodos de estado sólido</Bd> (6 o 12 según la fase). En el tubo, la corriente solo puede circular del cátodo al ánodo.</Li>
    </>} right={<>
      <H2c>4. Circuito de filamento</H2c>
      <Li>Transformador <Bd>reductor</Bd> (a ~10–12 V) con control de corriente de precisión — es el <Bd>selector de mA</Bd></Li>
      <H2c>5. Temporizador / Contactor</H2c>
      <Li>Determina la duración exacta de la exposición</Li>
      <Li>Generadores modernos: conmutador <Bd>IGBT</Bd> → tiempos de <Rd>1 ms</Rd> y precisión de microsegundos</Li>
      <H2c>6. Circuito de rotor</H2c>
      <Li>Alimenta el estator con corriente desfasada para generar el campo rotatorio. Incluye <Bd>frenado dinámico</Bd> al terminar la exposición.</Li>
      <Note type="k">Problema de examen: "Si el primario recibe 120 V y la relación de espiras es 800:1, ¿cuál es el kVp?" → 120 × 800 = <Rd>96 kVp</Rd></Note>
    </>} />
  </SW> },

  /* 42 ── 4.4 Tipos de generador y rizado */
  { id: '4.4', block: 'D', el: <SW block="D" lam="4.4" title="Tipos de generador y rizado">
    <Fml label="Rizado (ripple)">{String.raw`\%\,\text{Rizado} = \frac{V_{\max} - V_{\min}}{V_{\max}} \times 100`}</Fml>
    <Tbl sm num={[1, 2]} hs={['Tipo','Pulsos/ciclo','Rizado','Energía media','Estado']} rs={[
      ['Monofásico media onda','1',<Rd>100%</Rd>,'Muy baja','Obsoleto'],
      ['Monofásico onda completa','2',<Rd>100%</Rd>,'Baja','Obsoleto/dental'],
      ['Trifásico 6 pulsos','6','13–25%','Media','Legado'],
      ['Trifásico 12 pulsos','12','3–10%','Alta','Legado'],
      [<Rd>Alta frecuencia</Rd>,'— (5–100 kHz)',<Rd>&lt;1–4%</Rd>,<Rd>Máxima</Rd>,<Rd>Estándar actual</Rd>],
      ['Batería / Inversor','—','&lt;4%','Alta','Portátiles modernos'],
    ]} />
    <TwoCol left={<>
      <Note type="k">Con 100% de rizado, la tensión pasa por <Bd>cero</Bd> dos veces por ciclo. Durante buena parte del tiempo el tubo opera muy por debajo del kVp nominal, produciendo fotones de baja energía que <Bd>la filtración eliminará</Bd>. Ese calor y ese desgaste <Rd>no producen imagen</Rd>.</Note>
    </>} right={<>
      <H2c>Consecuencias de reducir el rizado</H2c>
      <Tbl sm hs={['Parámetro','Efecto al bajar el rizado']} rs={[
        ['Energía media del haz','↑'],
        ['Dosis al paciente para la misma imagen',<Rd>↓</Rd>],
        ['Vida útil del tubo','↑'],
        ['Reproducibilidad','↑'],
      ]} />
    </>} />
  </SW> },

  /* 43 ── 4.5 Alta frecuencia */
  { id: '4.5', block: 'D', el: <SW block="D" lam="4.5" title="El generador de alta frecuencia">
    <TwoCol left={<>
      <Def>El estándar de la industria desde los años 80.</Def>
      <H2c>Principio de operación</H2c>
      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#c0b8b8', background: P.card, padding: '10px 14px', borderRadius: 6, lineHeight: 1.9 }}>
        AC 60 Hz → RECTIFICADOR → DC →<br/>
        INVERSOR (5–100 kHz) →<br/>
        TRANSFORMADOR DE ALTA (pequeño) →<br/>
        RECTIFICADOR DE ALTA → FILTRO CAP →<br/>
        DC casi pura → TUBO<br/>
        &nbsp;&nbsp;↑<br/>
        REALIMENTACIÓN (corrige kVp en tiempo real)
      </div>
      <Note type="n">Por qué el transformador se achica: V = 4.44·f·N·A·B. Al subir f de 60 Hz a 50 000 Hz, se reducen N y A drásticamente. Un transformador de 50 kW cabe en una caja que se levanta con las manos.</Note>
    </>} right={<>
      <H2c>Ventajas decisivas</H2c>
      <Tbl hs={['Ventaja','Razón física']} rs={[
        [<Bd>Transformador pequeño y liviano</Bd>,'Tamaño ∝ 1/frecuencia'],
        [<Rd>Rizado &lt;1%</Rd>,'Filtrado capacitivo trivial a alta f'],
        [<Rd>Control de kVp en tiempo real</Rd>,'El inversor corrige ciclo a ciclo'],
        [<Bd>Tiempos de exposición de 1 ms</Bd>,'Conmutación de estado sólido'],
        [<Rd>Menor dosis para la misma imagen</Rd>,'Espectro más eficiente, menos fotones inútiles'],
        [<Bd>Insensible a fluctuaciones de la red</Bd>,'La realimentación compensa'],
        [<Bd>Permite portátiles potentes</Bd>,'Peso y volumen reducidos'],
      ]} />
      <Note type="k">"Un generador de alta frecuencia produce, con el mismo mAs, una imagen equivalente a un monofásico usando aproximadamente un <Rd>tercio menos de dosis</Rd>."</Note>
    </>} />
  </SW> },

  /* 44 ── 4.6 Modos de operación I */
  { id: '4.6', block: 'D', el: <SW block="D" lam="4.6" title="Modos de operación (I): radiografía">
    <TwoCol left={<>
      <H2c>Técnica: dos puntos vs. tres puntos</H2c>
      <Tbl hs={['Modo','El operador selecciona','El generador calcula']} rs={[
        [<Bd>Tres puntos</Bd>,'kVp, mA, tiempo','Nada — control manual total'],
        [<Bd>Dos puntos</Bd>,'kVp, mAs','Reparte mA y tiempo automáticamente'],
        [<Bd>APR (un punto)</Bd>,'Región anatómica y contextura','kVp, mAs y foco según protocolo almacenado'],
      ]} />
      <Note type="w">Los protocolos APR salen de fábrica con valores genéricos. <Bd>Deben ajustarse al receptor de imagen y a la población del hospital.</Bd> Un APR sin ajustar es una de las fuentes más comunes de sobredosis sistemática.</Note>
    </>} right={<>
      <H2c>AEC — Control Automático de Exposición</H2c>
      <Li>Un detector mide la radiación que ha atravesado al paciente y <Bd>corta la exposición</Bd> al alcanzar la cantidad predefinida</Li>
      <Tbl sm hs={['Estudio','Celdas activas']} rs={[
        ['Tórax PA','Las dos laterales (campos pulmonares)'],
        ['Abdomen','La central'],
        ['Columna lumbar lateral','La central'],
      ]} />
      <Note type="w"><Bd>Back-up timer (temporizador de respaldo):</Bd> límite absoluto de seguridad — no debe superar <Rd>600 mAs o 60 kJ</Rd>.</Note>
      <Note type="k">"Si el área anatómica de interés no cubre la celda activa, el AEC no puede funcionar."</Note>
    </>} />
  </SW> },

  /* 45 ── 4.7 Modos de operación II */
  { id: '4.7', block: 'D', el: <SW block="D" lam="4.7" title="Modos de operación (II): fluoroscopia">
    <TwoCol left={<>
      <H2c>Diferencia fundamental con la radiografía</H2c>
      <Tbl sm hs={['','Radiografía','Fluoroscopia']} rs={[
        ['Duración','Milisegundos',<Rd>Minutos</Rd>],
        ['mA típico','100–1000 mA',<Rd>0.5–5 mA</Rd>],
        ['Riesgo dominante','Dosis puntual',<Rd>Dosis acumulada</Rd>],
      ]} />
      <H2c>Fluoroscopia continua vs. pulsada</H2c>
      <Tbl sm hs={['','Continua','Pulsada']} rs={[
        ['Dosis','Referencia (100%)',<Rd>Reducción 30–90%</Rd>],
        ['Borroso cinético','Mayor','Menor (pulsos cortos congelan el movimiento)'],
        ['Estándar actual','Obsoleta',<Rd>Sí</Rd>],
      ]} />
      <Note type="k">Bajar de 30 fps a 7.5 fps reduce la dosis aproximadamente a la cuarta parte.</Note>
    </>} right={<>
      <H2c>Dispositivos de seguridad obligatorios</H2c>
      <Tbl sm hs={['Dispositivo','Función']} rs={[
        [<Bd>Interruptor hombre muerto (pedal)</Bd>,'La radiación cesa al soltar'],
        [<Bd>Temporizador acumulativo 5 min</Bd>,'Obliga a reconocer el tiempo transcurrido'],
        [<Bd>Límite de tasa de dosis</Bd>,'≤ 88 mGy/min (normal); ≤ 176 mGy/min (alta dosis)'],
        [<Bd>Indicación de dosis acumulada</Bd>,'Ka,r y PKA — registro obligatorio para intervencionismo'],
        [<Bd>Distancia mínima foco-piel</Bd>,'≥ 38 cm (fijo) / ≥ 30 cm (móvil)'],
      ]} />
      <Note type="w">Las lesiones radiodérmicas por fluoroscopia prolongada aparecen como eritema y necrosis <Bd>semanas después</Bd>. El registro de PKA es la única forma de identificar al paciente en riesgo antes de que aparezca la lesión.</Note>
    </>} />
  </SW> },

  /* 46 ── 4.8 Especificaciones técnicas */
  { id: '4.8', block: 'D', el: <SW block="D" lam="4.8" title="Especificaciones técnicas del generador">
    <H2c>Cómo leer una hoja de datos (y cómo escribir un pliego de licitación)</H2c>
    <Tbl sm hs={['Especificación','Valor típico','Qué significa realmente']} rs={[
      [<Bd>Potencia nominal</Bd>,'32, 50, 65, 80 kW','Potencia máx. a 100 kV y 0.1 s. Cifra de comparación estándar entre fabricantes'],
      [<Bd>Rango de kVp</Bd>,'40–150 kV','Determina las modalidades que puede cubrir'],
      [<Bd>Incremento de kVp</Bd>,'1 kV','Finura del ajuste'],
      [<Bd>Rango de mA</Bd>,'10–1000 mA','Combinado con el tiempo, define el mAs alcanzable'],
      [<Bd>Tiempo mínimo de exposición</Bd>,'1 ms','Crítico en pediatría y tórax'],
      [<Rd>Rizado</Rd>,'&lt;4% (típ. &lt;1%)','Calidad del haz'],
      [<Bd>Interfaz</Bd>,'DICOM MWL, MPPS, RDSR','Integración con RIS/PACS y registro de dosis'],
      [<Bd>Normas aplicables</Bd>,'IEC 60601-1, IEC 60601-2-54','Cumplimiento regulatorio'],
    ]} />
    <Note type="w"><Bd>Trampa de compra:</Bd> "Un fabricante puede anunciar '1000 mA' que solo son alcanzables a 60 kVp. La cifra honesta es la potencia en kW a 100 kV y 0.1 s. <Rd>Escriban el pliego en kW.</Rd>"</Note>
    <Note type="k"><Bd>Potencia = kVp × mA:</Bd> Un generador de 50 kW puede entregar 500 mA a 100 kVp, o 333 mA a 150 kVp. La potencia nominal es la restricción real, no el mA máximo del catálogo.</Note>
  </SW> },

  /* 47 ── 4.9 Pruebas de aceptación */
  { id: '4.9', block: 'D', el: <SW block="D" lam="4.9" title="Pruebas de aceptación y control de calidad del generador">
    <Tbl sm hs={['Prueba','Tolerancia típica','Instrumento','Frecuencia mínima']} rs={[
      [<Bd>Exactitud de kVp</Bd>,<Rd>±5% (o ±5 kV)</Rd>,'Medidor no invasivo de kVp','Anual'],
      [<Bd>Exactitud del tiempo</Bd>,'±5% (±10% para t&lt;10 ms)','Medidor de tiempo de exposición','Anual'],
      [<Bd>Linealidad del mAs</Bd>,'Coeficiente de linealidad &lt; 0.1','Cámara de ionización','Anual'],
      [<Bd>Reproducibilidad</Bd>,<Rd>CV &lt; 0.05</Rd>,'Cámara de ionización (5 disparos)','Anual'],
      [<Bd>HVL / calidad del haz</Bd>,'≥ 2.5 mm Al a 80 kVp','Láminas de Al calibradas + cámara','Anual'],
      [<Bd>Rendimiento (salida)</Bd>,'30–60 μGy/mAs a 1 m y 80 kVp','Cámara de ionización','Anual'],
      [<Bd>Radiación de fuga</Bd>,<Rd>≤ 1 mGy/h a 1 m</Rd>,'Cámara de gran volumen','En aceptación; tras cambio de tubo'],
      [<Bd>Coincidencia haz-luz</Bd>,'≤2% de la DFR','Plantilla de colimación','Semestral'],
    ]} />
    <Note type="k">"El generador no se evalúa por cómo se ve la imagen: <Bd>se evalúa por números medidos con instrumentos calibrados</Bd>."</Note>
  </SW> },

  /* 48 ── 4.10 Diagnóstico de fallas */
  { id: '4.10', block: 'D', el: <SW block="D" lam="4.10" title="Diagnóstico de fallas del generador">
    <Tbl sm hs={['Síntoma reportado','Causas probables (en orden de verificación)']} rs={[
      ['No enciende','Alimentación, protecciones, fusibles, llave de emergencia, fuente de control'],
      ['Enciende pero no dispara','Interlock de puerta, interlock térmico, rotor, error de filamento, pedal/disparador'],
      ['Dispara pero no hay imagen',<Rd>Colimador cerrado, receptor, cadena de imagen — NO es el generador</Rd>],
      ['Imágenes sistemáticamente claras','kVp bajo real, calibración de AEC desviada, resistencia de línea alta, filtración excesiva'],
      ['Imágenes sistemáticamente oscuras','kVp alto real, calibración de AEC, back-up timer mal ajustado'],
      [<Bd>Densidad inconsistente entre disparos</Bd>,<Rd>Reproducibilidad fuera de tolerancia — realimentación del inversor, tarjeta de control</Rd>],
      ['Se bloquea tras varios estudios','Interlock térmico — refrigeración, carga de trabajo, protocolos con mAs excesivo'],
      ['kVp inestable / arqueo','Tubo con vacío comprometido, aceite contaminado, cables de alta tensión'],
    ]} />
    <H2c>Metodología recomendada</H2c>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
      {['1. Reproducir la falla','2. Leer logs y códigos de error','3. Recorrer la cadena en orden','4. Medir, no suponer','5. Documentar'].map((s, i) => (
        <div key={i} style={{ border: `1px solid ${P.rd}`, borderRadius: 6, padding: '5px 12px', fontSize: 12, ...cf, color: '#c0a0a0' }}>{s}</div>
      ))}
    </div>
    <Note type="c"><Bd>REGLA DE ORO:</Bd> cables de alta tensión y condensadores retienen carga letal después de apagar el equipo. Nunca abrir el gabinete de alta sin seguir el procedimiento de descarga del fabricante y sin <Rd>bloqueo/etiquetado (LOTO)</Rd>.</Note>
  </SW> },

  /* 49 ── 4.11 Síntesis */
  { id: '4.11', block: 'D', el: <SW block="D" lam="4.11" title="Síntesis de la presentación">
    <H2c>Las 10 ideas que deben salir de esta sesión</H2c>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
      <div>
        <Ni n={1}>El radiodiagnóstico se basa en <Bd>atenuación diferencial</Bd>: la imagen es una sombra, no una foto.</Ni>
        <Ni n={2}>Los rayos X son <Bd>indirectamente ionizantes</Bd>: el daño lo hacen los electrones secundarios.</Ni>
        <Ni n={3}><Rd>Fotoeléctrico (∝ Z³/E³) = contraste. Compton = dispersa, ruido y riesgo ocupacional.</Rd></Ni>
        <Ni n={4}>La atenuación es exponencial: <M>{String.raw`I = I_0 e^{-\mu x}`}</M>, y la <M>{String.raw`\mathrm{HVL} = 0.693/\mu`}</M> es la medida práctica de calidad del haz.</Ni>
        <Ni n={5}>El tubo convierte <Rd>&lt;1% en rayos X y &gt;99% en calor</Rd>: casi todo su diseño es gestión térmica.</Ni>
      </div>
      <div>
        <Ni n={6}><Bd>Bremsstrahlung</Bd> = espectro continuo con techo en kVp (Duane-Hunt). <Bd>Característica</Bd> = líneas discretas; la serie K del W solo si kVp &gt; 69.5.</Ni>
        <Ni n={7}><Bd>mAs controla cantidad</Bd> (lineal); <Rd>kVp controla cantidad (∝kVp²) y calidad</Rd>.</Ni>
        <Ni n={8}>El <Bd>generador</Bd> convierte la red en alta tensión controlada; el <Bd>rizado</Bd> define la eficiencia del espectro y la dosis.</Ni>
        <Ni n={9}><Rd>Alta frecuencia</Rd> es el estándar: rizado &lt;1%, menor dosis, realimentación en tiempo real.</Ni>
        <Ni n={10}>Todo se verifica con <Bd>números medidos</Bd>: kVp ±5%, mAs ±10%, CV&lt;0.05, HVL ≥2.5 mm Al, fuga ≤1 mGy/h a 1 m.</Ni>
      </div>
    </div>
    <Note type="c">"¿Por qué instalamos en cada piso del hospital un equipo que produce un agente cancerígeno reconocido?" — Porque el beneficio diagnóstico lo justifica, <Bd>siempre que el equipo esté dentro de tolerancia y la técnica esté optimizada</Bd>. Y de eso, en el hospital, responde el ingeniero biomédico.</Note>
  </SW> },
]

// ── EMBERS ───────────────────────────────────────────────────────────────────
const EMBER_DATA = Array.from({ length: 14 }, (_, i) => ({
  left: `${4 + i * 6.5}%`,
  duration: `${6.5 + (i % 5) * 0.9}s`,
  delay: `${i * 0.45}s`,
  color: i % 3 === 0 ? P.rb : i % 3 === 1 ? '#9a1020' : P.red,
  size: i % 4 === 0 ? 4 : 2.5,
}))

function Embers() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {EMBER_DATA.map((e, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: `${(i * 7) % 20}%`, left: e.left,
          width: e.size, height: e.size, borderRadius: '50%', background: e.color,
          animation: `float-ember ${e.duration} linear infinite`,
          animationDelay: e.delay, opacity: 0,
        }} />
      ))}
    </div>
  )
}

// ── ARLECCHINO PHASE TRANSITION ───────────────────────────────────────────
// Three acts, orchestrated by App below:
//   I   BREAK    the outgoing slide fractures and collapses to black
//   II  CUT      dead frames
//   III REBUILD  the incoming slide reassembles out of displaced bands
//
// The displacement is real. Each act renders the slide several times over;
// every copy is clipped to a band that walks around the frame and is pushed
// sideways, so what you see tearing is the actual content, not a coloured
// rectangle sitting on top of it. BREAK reuses the REBUILD keyframes with
// animation-direction: reverse, so the fragments fly apart instead of
// converging.

const SLIDE_PAD = '34px 54px 20px'

// ── RANDOMISATION ──────────────────────────────────────────────────────────
// Fifty slides means fifty transitions, and a single choreography — however
// good — turns into wallpaper by slide ten. So every transition draws a fresh
// recipe: which of the five fracture variants plays, which way it travels, how
// far, which tears open, and where every bar and pixel lands.
//
// mulberry32: a seeded PRNG, so one seed reproduces the whole recipe. React
// may re-render mid-transition (window resize, HMR) and the look must not
// change underneath the animation, which a bare Math.random() in render would.

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Five ways to break. Block covers draw from the three most theatrical.
const VARIANTS = ['slam', 'crush', 'roll', 'stutter', 'swing'] as const
const CEREMONIAL_VARIANTS = ['crush', 'roll', 'swing'] as const

// Horizontal tears cut bands and slide them sideways, vertical ones cut
// columns and slide them up and down.
const SHARD_POOL = [
  'gx-shard-1', 'gx-shard-2', 'gx-shard-3', 'gx-shard-4',
  'gx-vshard-1', 'gx-vshard-2', 'gx-vshard-3',
]

const TINTS = [
  'brightness(1.5) contrast(1.35)',
  'invert(1) brightness(1.1)',
  'brightness(1.3) saturate(2.4)',
  'sepia(1) saturate(9) hue-rotate(-30deg) brightness(1.25)',
  'grayscale(1) brightness(2.3) contrast(1.7)',
]

const HBAR_ANIMS = ['gx-hbar-1', 'gx-hbar-2', 'gx-hbar-3', 'gx-hbar-4']
const VBAR_ANIMS = ['gx-vbar-1', 'gx-vbar-2', 'gx-vbar-3']
const BAR_COLORS = [
  'rgba(200,25,46,0.5)', 'rgba(232,37,58,0.4)',
  'rgba(255,60,80,0.7)', 'rgba(255,220,220,0.45)',
]

type Recipe = {
  variant: string
  dir: 1 | -1
  amp: number
  fragments: { name: string; filter: string }[]
  hBars: [string, number, string, string][]
  vBars: [string, number, string][]
  pixels: [string, string, number, string][]
  tearTop: string
}

function buildRecipe(seed: number, ceremonial: boolean, dir: 'r' | 'l', avoid: string | null): Recipe {
  const r = rng(seed)
  const pool = ceremonial ? CEREMONIAL_VARIANTS : VARIANTS

  // Never play the same variant twice running — back-to-back repeats are the
  // one thing an audience reliably notices.
  const candidates = pool.filter(v => v !== avoid)
  const variant = candidates[Math.floor(r() * candidates.length)]

  const take = <T,>(arr: readonly T[], n: number): T[] => {
    const rest = [...arr]
    const out: T[] = []
    while (out.length < n && rest.length) out.push(...rest.splice(Math.floor(r() * rest.length), 1))
    return out
  }

  // The chromatic ghosts always play — the red/cyan split is the signature —
  // then two to four tears on top, drawn from the pool.
  const fragments = [
    { name: 'gx-ghost-r', filter: 'sepia(1) saturate(14) hue-rotate(-38deg) brightness(1.15)' },
    { name: 'gx-ghost-c', filter: 'sepia(1) saturate(11) hue-rotate(150deg) brightness(1.1)' },
    ...take(SHARD_POOL, ceremonial ? 4 : 2 + Math.floor(r() * 2))
      .map(name => ({ name, filter: TINTS[Math.floor(r() * TINTS.length)] })),
  ]

  return {
    variant,
    dir: dir === 'r' ? 1 : -1,
    amp: +(0.75 + r() * 0.7).toFixed(2),
    fragments,
    hBars: Array.from({ length: 2 + Math.floor(r() * 3) }, () => [
      `${4 + Math.floor(r() * 84)}%`,
      6 + Math.floor(r() * 28),
      HBAR_ANIMS[Math.floor(r() * HBAR_ANIMS.length)],
      BAR_COLORS[Math.floor(r() * BAR_COLORS.length)],
    ] as [string, number, string, string]),
    vBars: Array.from({ length: 1 + Math.floor(r() * 3) }, () => [
      `${6 + Math.floor(r() * 80)}%`,
      18 + Math.floor(r() * 44),
      VBAR_ANIMS[Math.floor(r() * VBAR_ANIMS.length)],
    ] as [string, number, string]),
    pixels: Array.from({ length: 5 + Math.floor(r() * 6) }, () => [
      `${Math.floor(r() * 92)}%`,
      `${Math.floor(r() * 94)}%`,
      4 + Math.floor(r() * 8),
      `${(r() * 0.07).toFixed(3)}s`,
    ] as [string, string, number, string]),
    tearTop: `${25 + Math.floor(r() * 50)}%`,
  }
}

type Act = 'break' | 'rebuild'

function SlideLayers({
  act, recipe, dur, fragments, scrollTop, baseRef, children,
}: {
  act: Act
  recipe: Recipe
  dur: number
  fragments: boolean
  scrollTop: number
  baseRef?: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  const breaking = act === 'break'
  // Direction and amplitude reach the keyframes as custom properties, so one
  // keyframe set covers both travel directions and every throw distance.
  const params = {
    '--gx-dir': recipe.dir,
    '--gx-amp': recipe.amp,
  } as React.CSSProperties

  return (
    <>
      {/* Base layer — the real, scrollable, interactive slide */}
      <div
        ref={baseRef}
        id={breaking ? undefined : 'slide-content'}
        className="gx-base"
        style={{
          ...params,
          position: 'absolute', inset: 0, zIndex: 6,
          overflowY: breaking ? 'hidden' : 'auto',
          padding: SLIDE_PAD,
          animationName: `gx-${breaking ? 'out' : 'in'}-${recipe.variant}`,
          animationDuration: `${dur}ms`,
          animationTimingFunction: breaking ? 'cubic-bezier(0.55,0,1,0.45)' : 'cubic-bezier(0.16,1,0.3,1)',
          animationFillMode: 'both',
        }}
      >
        {/* Reproduces the scroll position the slide had when it was cut */}
        <div style={{ marginTop: -scrollTop }}>{children}</div>
      </div>

      {/* Displaced copies. steps(1) — no interpolation between keyframes, so
          every band snaps to its next position the way a broken signal does,
          and the browser never has to tween a clip-path.

          The fragment keyframes are authored for REBUILD: they do all their
          work in the first ~half and lie dormant (opacity 0, no offset) for
          the rest, which lets the base layer finish settling on its own.
          Played in reverse for BREAK that dormant half lands at the *front*
          of the act, so the fracture would only start once it was over. The
          negative delay skips straight to the midpoint: doubling the duration
          and offsetting by -dur makes the reversed run traverse exactly the
          live half over the act's real length. */}
      {fragments && recipe.fragments.map(f => (
        <div
          key={f.name}
          aria-hidden
          className="gx-layer"
          style={{
            ...params,
            position: 'absolute', inset: 0, zIndex: 7,
            mixBlendMode: 'screen',
            filter: f.filter,
            animationName: f.name,
            animationDuration: `${breaking ? dur * 2 : dur}ms`,
            animationDelay: breaking ? `${-dur}ms` : '0ms',
            animationDirection: breaking ? 'reverse' : 'normal',
            animationTimingFunction: 'steps(1, end)',
            animationFillMode: 'both',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, padding: SLIDE_PAD, marginTop: -scrollTop }}>
            {children}
          </div>
        </div>
      ))}
    </>
  )
}

// ── GLITCH OVERLAY ─────────────────────────────────────────────────────────
// Mounted once per act with that act's duration, so the same keyframes read
// as a frantic burst over BREAK (~300ms) and a slower decay over REBUILD.
// All of its geometry — bar count, position, thickness, colour, the pixel
// scatter, where the screen tears — comes from the recipe, so no two
// transitions produce the same pattern of debris.

function GlitchOverlay({
  act, dur, ceremonial, recipe,
}: { act: Act; dur: number; ceremonial: boolean; recipe: Recipe }) {
  const D = `${dur}ms both`
  const breaking = act === 'break'

  return (
    <div className="gx-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, overflow: 'hidden' }}>

      {/* Negative flashes — inverts everything painted below, so it must come
          first in the overlay's paint order. */}
      <div style={{ position: 'absolute', inset: 0, animation: `gx-invert ${D}` }} />

      {/* Dead frames: a closing black hold on BREAK, stuttering cuts on REBUILD */}
      <div style={{
        position: 'absolute', inset: 0, background: '#000',
        animation: `${breaking ? 'gx-black-tail' : 'gx-black'} ${D}`,
      }} />

      {/* White burst + crimson flood — the phase-in, so REBUILD only */}
      {!breaking && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: '#fff', animation: `gx-white ${D}` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(200,25,46,1)', animation: `gx-red ${D}`, mixBlendMode: 'screen' }} />
        </>
      )}

      {/* Chromatic wash */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,40,0.35)', animation: `gx-rgb-r ${D}`, mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,220,255,0.25)', animation: `gx-rgb-c ${D}`, mixBlendMode: 'screen' }} />

      {recipe.hBars.map(([top, h, anim, bg], i) => (
        <div key={`h${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top, height: h, background: bg,
          animation: `${anim} ${D}`, mixBlendMode: 'screen',
        }} />
      ))}

      {recipe.vBars.map(([left, w, anim], i) => (
        <div key={`v${i}`} style={{
          position: 'absolute', top: 0, bottom: 0,
          left, width: w,
          background: 'rgba(200,25,46,0.35)',
          animation: `${anim} ${D}`, mixBlendMode: 'screen',
        }} />
      ))}

      {/* Screen tear */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: recipe.tearTop, height: 6,
        background: 'rgba(255,40,60,0.8)',
        animation: `gx-tear ${D}`, mixBlendMode: 'screen',
      }} />

      {recipe.pixels.map(([top, left, size, delay], i) => (
        <div key={`p${i}`} style={{
          position: 'absolute', top, left,
          width: size, height: size,
          background: i % 2 === 0 ? 'rgba(200,25,46,0.9)' : 'rgba(255,220,220,0.8)',
          animation: `gx-px ${D}`,
          animationDelay: delay,
        }} />
      ))}

      {/* Scanline wash — the signal settling, so REBUILD only */}
      {!breaking && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 3px)',
          animation: `gx-scanlines ${D}`,
        }} />
      )}

      {/* Block covers get a crimson curtain dragged down the frame */}
      {ceremonial && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '55%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,25,46,0.55) 45%, rgba(255,80,100,0.9) 92%, #fff 100%)',
          animation: `gx-wipe ${D}`, mixBlendMode: 'screen',
        }} />
      )}
    </div>
  )
}

// ── GLITCH EMPHASIS HOOK ──────────────────────────────────────────────────
// Random elements on the resting slide get corrupted every couple of seconds.
const EM_CLASSES = ['glitch-em-a', 'glitch-em-b', 'glitch-em-c', 'glitch-em-d', 'glitch-em-e', 'glitch-em-f']
const EM_DURATION: Record<string, number> = {
  'glitch-em-a': 560, 'glitch-em-b': 500, 'glitch-em-c': 560,
  'glitch-em-d': 460, 'glitch-em-e': 620, 'glitch-em-f': 600,
}

function useGlitchEmphasis(aKey: number, active: boolean) {
  useEffect(() => {
    if (!active) return

    let cancelled = false
    let pending: number | undefined
    const cleanups: number[] = []

    const schedule = () => {
      const delay = 900 + Math.random() * 2100
      pending = window.setTimeout(() => {
        if (cancelled) return
        const container = document.getElementById('slide-content')
        if (!container) { schedule(); return }

        // Gather visible text elements. KaTeX builds a formula from dozens of
        // nested absolutely-positioned spans whose individual offsets carry
        // the layout — clipping or inverting one shreds the equation. Skip
        // anything inside .katex; the whole formula can still glitch as a
        // unit through its .tex / .eq-body wrapper.
        const all = Array.from(
          container.querySelectorAll<HTMLElement>('h1, h2, td, th, div, span, p')
        ).filter(el => {
          if (el.closest('.katex')) return false
          const txt = el.textContent?.trim() ?? ''
          return txt.length > 2 && txt.length < 200 && el.offsetHeight > 0
        })

        if (all.length === 0) { schedule(); return }

        // Usually one element, sometimes a cluster of three
        const r = Math.random()
        const count = r < 0.18 ? 3 : r < 0.5 ? 2 : 1
        const chosen = new Set<HTMLElement>()
        while (chosen.size < count && chosen.size < all.length) {
          chosen.add(all[Math.floor(Math.random() * all.length)])
        }

        chosen.forEach(el => {
          const cls = EM_CLASSES[Math.floor(Math.random() * EM_CLASSES.length)]
          el.classList.add(cls)
          cleanups.push(window.setTimeout(() => el.classList.remove(cls), EM_DURATION[cls] + 50))
        })

        schedule()
      }, delay)
    }

    // Let the entrance finish before corrupting anything
    const init = window.setTimeout(schedule, 500)
    return () => {
      cancelled = true
      clearTimeout(init)
      if (pending !== undefined) clearTimeout(pending)
      // Strip any class still mid-animation, or it sticks on the next slide
      cleanups.forEach(clearTimeout)
      document.querySelectorAll('.' + EM_CLASSES.join(', .'))
        .forEach(el => el.classList.remove(...EM_CLASSES))
    }
  }, [aKey, active])
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
const BLOCK_ACCENT: Record<string, string> = { A: '#c8192e', B: '#a81428', C: '#8a1020', D: '#6a0c18' }

// Act durations in ms. Block covers get the long, ceremonial version.
const TIMING = {
  normal:     { out: 300, in: 820 },
  ceremonial: { out: 360, in: 1180 },
  reduced:    { out: 0,   in: 200 },
} as const

const isCeremonial = (s: (typeof SLIDES)[number]) =>
  s.id === 'portada' || s.id.startsWith('bloque')

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const h = () => setReduced(mq.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return reduced
}

export default function App() {
  const [cur, setCur] = useState(0)
  const [aKey, setAKey] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'break' | 'rebuild'>('idle')
  const [outIdx, setOutIdx] = useState<number | null>(null)
  const [outScroll, setOutScroll] = useState(0)
  const [ceremonial, setCeremonial] = useState(false)
  const [dur, setDur] = useState<{ out: number; in: number }>(TIMING.normal)
  const [recipe, setRecipe] = useState<Recipe>(() => buildRecipe(1, false, 'r', null))
  const [fullscreen, setFullscreen] = useState(false)

  const baseRef = useRef<HTMLDivElement | null>(null)
  const timers = useRef<number[]>([])
  const lastVariant = useRef<string | null>(null)
  const reduced = useReducedMotion()

  useGlitchEmphasis(aKey, phase === 'idle' && !reduced)
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const total = SLIDES.length
  const slide = SLIDES[cur]
  const accent = slide.block ? BLOCK_ACCENT[slide.block] : P.red
  const progress = ((cur + 1) / total) * 100

  const go = (n: number, d: 'r' | 'l') => {
    if (n < 0 || n >= total || n === cur) return

    // Navigating mid-transition restarts the sequence rather than queueing a
    // second one — otherwise the pending timers would strand a stale layer.
    timers.current.forEach(clearTimeout)
    timers.current = []

    const cer = isCeremonial(SLIDES[n])
    const t = reduced ? TIMING.reduced : cer ? TIMING.ceremonial : TIMING.normal

    // One recipe for the whole transition, so BREAK and REBUILD agree on the
    // variant, direction and amplitude and the two acts read as one event.
    const rec = buildRecipe((Math.random() * 0xffffffff) >>> 0, cer, d, lastVariant.current)
    lastVariant.current = rec.variant

    setOutScroll(baseRef.current?.scrollTop ?? 0)
    setRecipe(rec)
    setCeremonial(cer)
    setDur(t)
    setAKey(k => k + 1)
    setOutIdx(cur)
    setCur(n)
    setPhase('break')

    timers.current.push(window.setTimeout(() => {
      setOutIdx(null)
      setPhase('rebuild')
    }, t.out))
    timers.current.push(window.setTimeout(() => setPhase('idle'), t.out + t.in))
  }
  const next = () => go(cur + 1, 'r')
  const prev = () => go(cur - 1, 'l')

  // F toggles fullscreen. requestFullscreen rejects if the browser refuses
  // (no user gesture, or the permission is blocked) — swallow it rather than
  // throwing an unhandled rejection in the middle of a lecture.
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (['ArrowRight','ArrowDown',' '].includes(e.key)) { e.preventDefault(); go(cur + 1, 'r') }
      if (['ArrowLeft','ArrowUp'].includes(e.key)) { e.preventDefault(); go(cur - 1, 'l') }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [cur, reduced])

  // Esc and the window chrome can leave fullscreen without going through the
  // key handler, so the flag tracks the document rather than our own calls.
  useEffect(() => {
    const h = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  const btnBase: React.CSSProperties = {
    background: 'transparent', borderRadius: 6, padding: '6px 18px',
    fontSize: 13, fontFamily: "'Cinzel', serif", letterSpacing: '0.06em',
    cursor: 'pointer', transition: 'all 0.2s',
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: P.bg, overflow: 'hidden', position: 'relative' }}>
      {/* bg glow */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 80% 50%, rgba(100,10,20,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(80,8,16,0.12) 0%, transparent 50%)` }} />

      <Embers />

      {/* progress bar */}
      <div style={{ height: 3, background: '#120610', flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <div style={{ height: '100%', background: `linear-gradient(to right, ${accent}, ${P.rb})`, width: `${progress}%`, transition: 'width 0.4s ease', boxShadow: '0 0 10px rgba(200,25,46,0.6)' }} />
      </div>

      {/* slide area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 5 }}>
        {/* ACT I — the outgoing slide, mounted only while it is coming apart */}
        {outIdx !== null && (
          <SlideLayers
            key={`break-${aKey}`}
            act="break" recipe={recipe} dur={dur.out}
            fragments={!reduced} scrollTop={outScroll}
          >
            {SLIDES[outIdx].el}
          </SlideLayers>
        )}

        {/* ACT III — the incoming slide. Fragment copies exist only for the
            length of the rebuild; at rest this is a single plain layer. */}
        {phase !== 'break' && (
          <SlideLayers
            key={`rebuild-${aKey}`}
            act="rebuild" recipe={recipe} dur={dur.in}
            fragments={!reduced && phase === 'rebuild'} scrollTop={0}
            baseRef={baseRef}
          >
            {slide.el}
          </SlideLayers>
        )}

        {phase !== 'idle' && !reduced && (
          <GlitchOverlay
            key={`ov-${phase}-${aKey}`}
            act={phase}
            dur={phase === 'break' ? dur.out : dur.in}
            ceremonial={ceremonial}
            recipe={recipe}
          />
        )}
      </div>

      {/* nav bar */}
      <div style={{ height: 50, background: '#0c0508', borderTop: `1px solid ${P.brd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={prev} disabled={cur === 0}
            style={{ ...btnBase, border: `1px solid ${cur === 0 ? '#1e0e14' : '#4a1020'}`, color: cur === 0 ? '#2a1018' : '#d0b8b8', opacity: cur === 0 ? 0.3 : 1 }}>
            ← Anterior
          </button>
          <button
            onClick={toggleFullscreen}
            title={fullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
            style={{
              ...btnBase, ...ui, padding: '5px 11px', fontSize: 11,
              border: `1px solid ${fullscreen ? P.red : '#2e1218'}`,
              color: fullscreen ? P.rb : '#6a4a52',
              letterSpacing: '0.1em',
            }}>
            {fullscreen ? '⤡ F' : '⤢ F'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {slide.block && (
            <div style={{ background: accent, borderRadius: 4, padding: '2px 10px', fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.12em' }}>
              {slide.block}
            </div>
          )}
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12.5, color: P.muted, letterSpacing: '0.06em' }}>
            {cur + 1} <span style={{ color: '#2a1018' }}>/</span> {total}
          </span>
          {slide.id !== 'portada' && !slide.id.startsWith('bloque') && (
            <span style={{ fontSize: 11, color: '#4a2830', fontFamily: "'Cinzel', serif", letterSpacing: '0.1em' }}>
              LÁMINA {slide.id.toUpperCase()}
            </span>
          )}
        </div>

        <button onClick={next} disabled={cur === total - 1}
          style={{ ...btnBase, background: cur === total - 1 ? 'transparent' : accent, border: `1px solid ${cur === total - 1 ? '#1e0e14' : accent}`, color: cur === total - 1 ? '#2a1018' : '#fff', opacity: cur === total - 1 ? 0.3 : 1 }}>
          Siguiente →
        </button>
      </div>
    </div>
  )
}
