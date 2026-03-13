import React from 'react'

/* ── Button ─────────────────────────────────────────── */
const variantMap = {
  black:   { background:'#0A0A0A', color:'#fff', border:'none' },
  outline: { background:'transparent', color:'#242424', border:'1.5px solid #E6E6E6' },
  ghost:   { background:'#F2F2F2', color:'#242424', border:'none' },
  danger:  { background:'transparent', color:'#991B1B', border:'1.5px solid #FCA5A5' },
}
const sizeMap = {
  lg: { padding:'16px 24px', fontSize:15, borderRadius:12 },
  md: { padding:'12px 18px', fontSize:14, borderRadius:8  },
  sm: { padding:'8px 13px',  fontSize:13, borderRadius:8  },
  xs: { padding:'5px 10px',  fontSize:12, borderRadius:6  },
}

export function Btn({ variant='outline', size='md', full, onClick, children, style, disabled }) {
  const v = variantMap[variant] || variantMap.outline
  const s = sizeMap[size] || sizeMap.md
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7,
        fontFamily:'DM Sans,sans-serif', fontWeight:600, letterSpacing:'0.15px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        width: full ? '100%' : undefined,
        transition:'all .14s',
        WebkitTapHighlightColor:'transparent',
        whiteSpace:'nowrap',
        ...v, ...s, ...style,
      }}
    >
      {children}
    </button>
  )
}

/* ── CTA button (Bebas Neue) ─────────────────────────── */
export function CtaBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width:'100%', background:'#0A0A0A', color:'#fff', border:'none',
        borderRadius:12, padding:'17px 24px',
        fontFamily:'Bebas Neue,sans-serif', fontSize:19, letterSpacing:3,
        cursor:'pointer', transition:'all .15s',
        WebkitTapHighlightColor:'transparent',
      }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(0.98)'}
      onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      onTouchStart={e=>e.currentTarget.style.transform='scale(0.98)'}
      onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}
    >
      {children}
    </button>
  )
}

/* ── Card ────────────────────────────────────────────── */
export function Card({ children, style }) {
  return (
    <div style={{
      background:'#fff', border:'1px solid #E6E6E6',
      borderRadius:12, padding:18, marginBottom:11,
      boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── Card Header ─────────────────────────────────────── */
export function CardHead({ left, right }) {
  return (
    <div style={{
      fontSize:10, fontWeight:700, letterSpacing:2, color:'#999',
      textTransform:'uppercase', marginBottom:14,
      paddingBottom:10, borderBottom:'1px solid #E6E6E6',
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <span>{left}</span>
      {right && <span>{right}</span>}
    </div>
  )
}

/* ── Field ───────────────────────────────────────────── */
export function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom:13, ...style }}>
      {label && (
        <label style={{
          display:'block', fontSize:11, fontWeight:600,
          letterSpacing:1, textTransform:'uppercase',
          color:'#555', marginBottom:5,
        }}>
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

/* ── Input ───────────────────────────────────────────── */
export function Input({ value, onChange, placeholder, type='text', style }) {
  const [focused, setFocused] = React.useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={()=>setFocused(true)}
      onBlur={()=>setFocused(false)}
      style={{
        width:'100%', background: focused ? '#fff' : '#F9F9F9',
        border: focused ? '1.5px solid #0A0A0A' : '1.5px solid #E6E6E6',
        borderRadius:8, color:'#0A0A0A',
        padding:'11px 13px', fontSize:16,
        fontFamily:'DM Sans,sans-serif', fontWeight:500,
        outline:'none',
        transition:'border-color .14s, box-shadow .14s',
        boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.07)' : 'none',
        WebkitAppearance:'none',
        ...style,
      }}
    />
  )
}

/* ── Bottom Drawer Modal ─────────────────────────────── */
export function Drawer({ open, onClose, title, children }) {
  return (
    <div
      onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{
        position:'fixed', inset:0,
        background: open ? 'rgba(0,0,0,0.52)' : 'transparent',
        zIndex:900,
        display:'flex', alignItems:'flex-end', justifyContent:'center',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition:'opacity .22s',
      }}
    >
      <div style={{
        background:'#fff', borderRadius:'18px 18px 0 0',
        width:'100%', maxWidth:560,
        padding:18,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition:'transform .28s cubic-bezier(0.4,0,0.2,1)',
        maxHeight:'72vh', overflowY:'auto',
      }}>
        {/* Handle */}
        <div style={{ width:34,height:4,background:'#E6E6E6',borderRadius:2,margin:'0 auto 14px' }} />
        {/* Title row */}
        <div style={{
          fontFamily:'Bebas Neue,sans-serif', fontSize:17, letterSpacing:2,
          marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <span>{title}</span>
          <button
            onClick={onClose}
            style={{
              width:26, height:26, borderRadius:'50%', background:'#F2F2F2',
              border:'none', cursor:'pointer', display:'flex',
              alignItems:'center', justifyContent:'center', fontSize:15, color:'#555',
            }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ── Section heading ─────────────────────────────────── */
export function PageTitle({ label, title }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11,fontWeight:600,letterSpacing:'2.5px',color:'#999',textTransform:'uppercase',marginBottom:6 }}>
        {label}
      </div>
      <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:34,letterSpacing:2,color:'#0A0A0A',lineHeight:1 }}>
        {title}
      </div>
    </div>
  )
}

/* ── Divider ─────────────────────────────────────────── */
export function Divider({ mt=12, mb=12 }) {
  return <div style={{ height:1, background:'#E6E6E6', margin:`${mt}px 0 ${mb}px` }} />
}

/* ── Info Bar ────────────────────────────────────────── */
export function InfoBar({ items }) {
  return (
    <div style={{
      background:'#F2F2F2', borderRadius:8, padding:'9px 13px',
      display:'flex', gap:14, flexWrap:'wrap', marginBottom:14,
      fontSize:12, fontWeight:600, color:'#555',
    }}>
      {items.map((item, i) => (
        <span key={i}>{item.label} <strong style={{ color:'#0A0A0A' }}>{item.value}</strong></span>
      ))}
    </div>
  )
}

/* ── Chip ────────────────────────────────────────────── */
export function Chip({ children, used, onDragStart, onClick, style }) {
  return (
    <div
      draggable={!used}
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        padding:'6px 14px', borderRadius:100,
        border:'1.5px solid #E6E6E6', background: used ? '#F2F2F2' : '#fff',
        fontSize:13, fontWeight:600, color: used ? '#C8C8C8' : '#0A0A0A',
        cursor: used ? 'default' : 'grab',
        opacity: used ? 0.4 : 1,
        pointerEvents: used ? 'none' : 'auto',
        transition:'all .14s',
        userSelect:'none',
        WebkitTapHighlightColor:'transparent',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────── */
export function EmptyState({ title, subtitle }) {
  return (
    <div style={{ textAlign:'center', padding:'44px 16px', color:'#999' }}>
      <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, letterSpacing:2, color:'#C8C8C8', marginBottom:8 }}>
        {title}
      </div>
      <div style={{ fontSize:14, lineHeight:1.7 }}>{subtitle}</div>
    </div>
  )
}
