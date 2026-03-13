import React from 'react'

// SVG-style brand logos as styled text with distinctive weights
const BRANDS = [
  { name: 'YONEX',    color: '#E8A000' },
  { name: 'VICTOR',   color: '#CC2222' },
  { name: 'LI-NING',  color: '#CC2222' },
  { name: 'APACS',    color: '#1A6FC4' },
  { name: 'FORZA',    color: '#111'    },
  { name: 'BABOLAT',  color: '#CC2222' },
  { name: 'MIZUNO',   color: '#1A44A8' },
  { name: 'WILSON',   color: '#CC2222' },
  { name: 'ASHAWAY',  color: '#1A6FC4' },
  { name: 'CARLTON',  color: '#006633' },
  { name: 'RSL',      color: '#CC2222' },
  { name: 'KARAKAL',  color: '#E8A000' },
  { name: 'FLEET',    color: '#1A44A8' },
]

export default function BrandStrip() {
  // White background brand strip — logos shown in brand colors
  const items = [...BRANDS, ...BRANDS]

  return (
    <div style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E6E6E6',
      overflow: 'hidden',
      height: 44,
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        animation: 'marquee 28s linear infinite',
        whiteSpace: 'nowrap',
        paddingLeft: '100vw',
        flexShrink: 0,
      }}>
        {items.map((b, i) => (
          <React.Fragment key={i}>
            <span style={{
              fontFamily: 'Bebas Neue,sans-serif',
              letterSpacing: 2.5,
              fontSize: 14,
              color: b.color,
              flexShrink: 0,
              padding: '0 20px',
              opacity: 0.82,
            }}>{b.name}</span>
            <span style={{
              width: 1,
              height: 16,
              background: '#E0E0E0',
              display: 'inline-block',
              flexShrink: 0,
              verticalAlign: 'middle',
            }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
