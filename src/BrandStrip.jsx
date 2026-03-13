import React from 'react'

const BRANDS = ['YONEX','VICTOR','LI-NING','APACS','FORZA','BABOLAT','MIZUNO','WILSON','ASHAWAY','CARLTON','RSL','KARAKAL','FLEET']

export default function BrandStrip() {
  const items = [...BRANDS, ...BRANDS] // duplicate for seamless loop
  return (
    <div style={{
      background:'#0A0A0A', overflow:'hidden',
      height:30, display:'flex', alignItems:'center',
      flexShrink:0,
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:32,
        animation:'marquee 24s linear infinite',
        whiteSpace:'nowrap',
        paddingLeft:'100vw',
        flexShrink:0,
      }}>
        {items.map((b, i) => (
          <React.Fragment key={i}>
            <span style={{
              fontFamily:'Bebas Neue,sans-serif',
              letterSpacing:3, fontSize:12,
              color:'rgba(255,255,255,0.28)',
              flexShrink:0,
            }}>{b}</span>
            <span style={{
              width:3, height:3, borderRadius:'50%',
              background:'rgba(255,255,255,0.10)',
              display:'inline-block', flexShrink:0,
            }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
