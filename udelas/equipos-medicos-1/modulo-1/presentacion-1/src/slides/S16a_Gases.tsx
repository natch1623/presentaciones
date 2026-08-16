import { At, Ghost, Halo, Title, Ac, CY, CYM, WH, WD, WF, dly } from './Stage'

const gases = [
  { gas: 'Oxígeno (O₂)', use: 'Ventilación, mezcla anestésica', pressure: '345–380 kPa (50–55 psi)', nfpa: 'Verde', iso: 'Blanco' },
  { gas: 'Aire medicinal', use: 'Gas portador, ventiladores', pressure: '345–380 kPa (50–55 psi)', nfpa: 'Amarillo', iso: 'Blanco/Negro' },
  { gas: 'Óxido nitroso (N₂O)', use: 'Coadyuvante anestésico', pressure: '345 kPa (50 psi)', nfpa: 'Azul', iso: 'Azul' },
  { gas: 'Vacío / succión clínica', use: 'Aspiración de fluidos y humo', pressure: '≥ 300 mmHg (≥ 12 inHg)', nfpa: 'Blanco', iso: 'Amarillo' },
  { gas: 'CO₂', use: 'Insuflación en laparoscopía', pressure: 'Regulado en el insuflador', nfpa: 'Gris', iso: 'Gris' },
  { gas: 'AGSS', use: 'Evacuación de gases anestésicos espirados', pressure: 'Sistema de vacío dedicado', nfpa: '—', iso: '—' },
  { gas: 'Aire de instrumentos', use: 'Herramientas neumáticas ortopédicas', pressure: '1100–1380 kPa (160–200 psi)', nfpa: '—', iso: '—' },
]

const colorMap: Record<string, string> = {
  Verde: '#22c55e',
  Amarillo: '#eab308',
  Azul: '#3b82f6',
  Blanco: '#e2e8f0',
  'Blanco/Negro': '#94a3b8',
  Gris: '#6b7280',
  '—': '#374151',
}

/**
 * Los siete gases. Es información tabular de verdad, así que se
 * presenta como registro y no como tabla: ni fondos alternos, ni
 * bordes, ni celdas. Solo el nombre del gas en cuerpo grande, los
 * datos alineados a su derecha y una hairline que se desvanece.
 */
export default function S16a_Gases() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="O₂" side="right" size={400} top={480} opacity={0.028} />
      <Halo x={180} y={220} size={680} color="rgba(0,212,255,0.13)" />
      <Halo x={1260} y={640} size={640} color="rgba(34,197,94,0.1)" />

      <At l={96} t={80} w={1040} anim="none">
        <Title size={46} d={0}>
          Gases medicinales en el <Ac>salón de operaciones</Ac>
        </Title>
      </At>

      {/* Encabezados: sueltos sobre las columnas, sin barra */}
      <At l={100} t={168} w={1240} d={1}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
          {[
            { h: 'Gas', w: 270 },
            { h: 'Uso en quirófano', w: 420 },
            { h: 'Presión nominal', w: 230 },
            { h: 'NFPA 99', w: 130 },
            { h: 'ISO 32', w: 130 },
          ].map(c => (
            <span
              key={c.h}
              className="font-mono"
              style={{ width: c.w, flexShrink: 0, fontSize: 9, color: CYM, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75 }}
            >
              {c.h}
            </span>
          ))}
        </div>
      </At>

      {gases.map((g, i) => (
        <At key={g.gas} l={100} t={212 + i * 76} w={1240} d={2 + i} anim="drift">
          <div style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
            <span style={{ width: 270, flexShrink: 0, fontSize: 19, color: WH, fontWeight: 400, lineHeight: 1.3 }}>
              {g.gas}
            </span>
            <span style={{ width: 420, flexShrink: 0, fontSize: 14, color: WD, lineHeight: 1.45, fontWeight: 300 }}>
              {g.use}
            </span>
            <span className="font-mono" style={{ width: 230, flexShrink: 0, fontSize: 12.5, color: CY, lineHeight: 1.4 }}>
              {g.pressure}
            </span>
            {[g.nfpa, g.iso].map((c, k) => (
              <span key={k} style={{ width: 130, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
                    background: colorMap[c] || '#374151',
                    boxShadow: c === '—' ? 'none' : `0 0 10px ${colorMap[c]}66`,
                  }}
                />
                <span style={{ fontSize: 11.5, color: WF }}>{c}</span>
              </span>
            ))}
          </div>
          <div
            className="span-x"
            style={{
              width: 1220, height: 1, marginTop: 18,
              background: 'linear-gradient(90deg, rgba(0,212,255,0.14), rgba(0,212,255,0.03), transparent)',
              ...dly(3 + i),
            }}
          />
        </At>
      ))}
    </div>
  )
}
