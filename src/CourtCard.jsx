import React from 'react'
import { getWarnings } from './helpers.js'

function PlayerSlot({ player, team, onClick, onRemove, onDragOver, onDrop, onDragLeave }) {
  const [hover, setHover] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={e => { e.preventDefault(); setDragOver(true); onDragOver?.() }}
      onDragLeave={() => { setDragOver(false); onDragLeave?.() }}
      onDrop={e => { setDragOver(false); onDrop?.(e) }}
      style={{
        minHeight:40, borderRadius:7,
        border: player
          ? `1.5px solid ${dragOver ? '#0A0A0A' : '#E6E6E6'}`
          : `1.5px dashed ${dragOver ? '#0A0A0A' : '#E6E6E6'}`,
        borderLeft: player
          ? `3px solid ${team === 'A' ? '#0A0A0A' : '#999'}`
          : undefined,
        display:'flex', alignItems:'center', padding:'0 9px',
        fontSize:13, fontWeight:600, marginBottom:5,
        cursor:'pointer',
        background: dragOver ? '#F2F2F2' : (hover && !player ? '#F9F9F9' : (player ? '#fff' : '#FAFAFA')),
        color:'#0A0A0A', position:'relative',
        transition:'all .13s',
        userSelect:'none',
        WebkitTapHighlightColor:'transparent',
      }}
    >
      {player ? (
        <>
          <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {player}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onRemove?.() }}
            style={{
              width:20, height:20, borderRadius:4, background:'transparent', border:'none',
              color:'#999', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, opacity: hover ? 1 : 0, transition:'opacity .13s', flexShrink:0,
            }}
          >×</button>
        </>
      ) : (
        <span style={{ fontSize:11, color:'#C8C8C8', fontWeight:400 }}>Chọn người chơi</span>
      )}
    </div>
  )
}

export default function CourtCard({ rounds, ri, ci, court, onSlotClick, onSlotClear, onDrop }) {
  const warns = getWarnings(rounds, ri, ci)
  const filled = [...court.A, ...court.B].filter(Boolean).length

  return (
    <div style={{
      border:'1.5px solid #E6E6E6', borderRadius:12,
      overflow:'hidden', marginBottom:11, background:'#fff',
      boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Court header */}
      <div style={{
        background:'#0A0A0A', color:'#fff',
        padding:'10px 15px',
        fontFamily:'Bebas Neue,sans-serif', fontSize:14, letterSpacing:3,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <span>SAN {ci + 1}</span>
        <span style={{ fontSize:10, letterSpacing:1, color:'rgba(255,255,255,0.45)', fontFamily:'DM Sans,sans-serif', fontWeight:500 }}>
          {filled}/4 NGƯỜI
        </span>
      </div>

      {/* Warnings */}
      {warns.map((w, i) => (
        <div key={i} style={{
          background:'#FFFBEB', border:'none',
          borderBottom:'1px solid #FDE68A',
          padding:'7px 14px', fontSize:12, color:'#92400E', fontWeight:500,
        }}>
          ⚠ {w}
        </div>
      ))}

      {/* Teams */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 40px 1fr' }}>
        {/* Team A */}
        <div style={{ padding:'13px 11px' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#0A0A0A', marginBottom:9 }}>
            Team A
          </div>
          {[0, 1].map(si => (
            <PlayerSlot
              key={si}
              player={court.A[si]}
              team="A"
              onClick={() => onSlotClick(ci, 'A', si, court.A[si])}
              onRemove={() => onSlotClear(ci, 'A', si)}
              onDrop={e => onDrop(e, ci, 'A')}
            />
          ))}
        </div>

        {/* VS divider */}
        <div style={{ padding:'13px 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3 }}>
          <div style={{ width:1, height:26, background:'#E6E6E6' }} />
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:10, letterSpacing:1, color:'#C8C8C8' }}>VS</div>
          <div style={{ width:1, height:26, background:'#E6E6E6' }} />
        </div>

        {/* Team B */}
        <div style={{ padding:'13px 11px' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#555', marginBottom:9 }}>
            Team B
          </div>
          {[0, 1].map(si => (
            <PlayerSlot
              key={si}
              player={court.B[si]}
              team="B"
              onClick={() => onSlotClick(ci, 'B', si, court.B[si])}
              onRemove={() => onSlotClear(ci, 'B', si)}
              onDrop={e => onDrop(e, ci, 'B')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
