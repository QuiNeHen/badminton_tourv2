import React from 'react'
import { Drawer, Btn } from './ui.jsx'

export default function PlayerPicker({ open, onClose, target, players, usedSet, onAssign, onClear }) {
  if (!target) return null
  const { ci, team, si } = target
  const currentPlayer = target.currentVal

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Sân ${ci + 1} · Team ${team} · Vị trí ${si + 1}`}
    >
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))', gap:7 }}>
        {players.map((p, i) => {
          const isUsed = usedSet.has(p.name) && p.name !== currentPlayer
          return (
            <button
              key={i}
              disabled={isUsed}
              onClick={() => !isUsed && onAssign(p.name)}
              style={{
                padding:'11px 8px', borderRadius:9,
                background: isUsed ? '#F9F9F9' : '#fff',
                border:'1.5px solid #E6E6E6',
                color: isUsed ? '#C8C8C8' : '#0A0A0A',
                fontSize:13, fontWeight:600, cursor: isUsed ? 'not-allowed' : 'pointer',
                textAlign:'center', fontFamily:'DM Sans,sans-serif',
                opacity: isUsed ? 0.35 : 1,
                transition:'all .13s',
              }}
              onMouseOver={e=>{ if(!isUsed){ e.currentTarget.style.background='#F2F2F2' }}}
              onMouseOut={e=>{ if(!isUsed){ e.currentTarget.style.background='#fff' }}}
            >
              {p.name}
            </button>
          )
        })}
        {currentPlayer && (
          <button
            onClick={onClear}
            style={{
              padding:'11px 8px', borderRadius:9,
              background:'transparent', border:'1.5px solid #FCA5A5',
              color:'#991B1B', fontSize:13, fontWeight:600, cursor:'pointer',
              textAlign:'center', fontFamily:'DM Sans,sans-serif',
              transition:'all .13s',
            }}
          >
            Bỏ trống
          </button>
        )}
      </div>
      <div style={{ marginTop:14 }}>
        <Btn variant="outline" full onClick={onClose}>Hủy</Btn>
      </div>
    </Drawer>
  )
}
