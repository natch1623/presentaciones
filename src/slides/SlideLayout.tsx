import type { ReactNode, CSSProperties } from 'react'

interface SlideLayoutProps {
  children: ReactNode
  style?: CSSProperties
  scrollable?: boolean
}

export function SlideLayout({ children, style, scrollable }: SlideLayoutProps) {
  return (
    <div
      className={scrollable ? 'slide-scroll' : ''}
      style={{
        width: '100%',
        height: '100%',
        padding: '28px 44px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: scrollable ? 'auto' : 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function SlideTag({ children }: { children: ReactNode }) {
  return (
    <div
      className="font-mono tag-reveal"
      style={{
        fontSize: 10,
        letterSpacing: '0.16em',
        color: 'var(--cyan-mid)',
        textTransform: 'uppercase',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 1.5,
          background: 'linear-gradient(90deg, var(--cyan-bright), transparent)',
          boxShadow: '0 0 6px var(--cyan-bright)',
        }}
      />
      {children}
    </div>
  )
}

export function SlideTitle({ children, size = 'lg' }: { children: ReactNode; size?: 'lg' | 'md' | 'sm' }) {
  const sizes = { lg: 44, md: 33, sm: 26 }
  return (
    <h2
      className="font-display title-reveal"
      style={{
        fontSize: sizes[size],
        lineHeight: 1.15,
        color: 'var(--white)',
        margin: 0,
        marginBottom: 20,
        fontWeight: 400,
      }}
    >
      {children}
    </h2>
  )
}

export function CyanAccent({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        color: 'var(--cyan-bright)',
        textShadow: '0 0 24px rgba(0,212,255,0.45)',
      }}
    >
      {children}
    </span>
  )
}

export function Card({
  children,
  style,
  accent = 'cyan',
  animated = true,
}: {
  children: ReactNode
  style?: CSSProperties
  accent?: 'cyan' | 'violet' | 'gold' | 'none'
  animated?: boolean
}) {
  const borders: Record<string, string> = {
    cyan:   'rgba(0,212,255,0.28)',
    violet: 'rgba(109,40,217,0.38)',
    gold:   'rgba(245,158,11,0.28)',
    none:   'rgba(240,249,255,0.09)',
  }
  const shadows: Record<string, string> = {
    cyan:   '0 0 30px rgba(0,212,255,0.06)',
    violet: '0 0 30px rgba(109,40,217,0.1)',
    gold:   '0 0 30px rgba(245,158,11,0.06)',
    none:   'none',
  }
  return (
    <div
      className={animated ? 'card-hover' : ''}
      style={{
        background: 'linear-gradient(135deg, rgba(10,26,74,0.75) 0%, rgba(6,15,46,0.92) 100%)',
        border: `1px solid ${borders[accent]}`,
        borderRadius: 12,
        padding: '18px 22px',
        backdropFilter: 'blur(10px)',
        boxShadow: `inset 0 0 24px rgba(0,0,0,0.2), ${shadows[accent]}, 0 4px 20px rgba(0,0,0,0.35)`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Divider({ style }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--border-bright), transparent)',
        margin: '14px 0',
        ...style,
      }}
    />
  )
}

export function Badge({ children, variant = 'cyan' }: { children: ReactNode; variant?: 'cyan' | 'violet' | 'gold' }) {
  const c: Record<string, { bg: string; color: string }> = {
    cyan:   { bg: 'rgba(0,212,255,0.1)',    color: 'var(--cyan-bright)' },
    violet: { bg: 'rgba(109,40,217,0.2)',   color: '#a78bfa' },
    gold:   { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  }
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 10,
        letterSpacing: '0.1em',
        padding: '3px 10px',
        borderRadius: 4,
        background: c[variant].bg,
        color: c[variant].color,
        border: `1px solid ${c[variant].color}40`,
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  )
}

/* Glowing animated number stat */
export function StatBlock({ value, label, color = 'var(--cyan-bright)' }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className="font-display stagger-item"
        style={{
          fontSize: 52,
          lineHeight: 1,
          color,
          textShadow: `0 0 30px ${color}80`,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--white-faint)', lineHeight: 1.4 }}>{label}</div>
    </div>
  )
}
