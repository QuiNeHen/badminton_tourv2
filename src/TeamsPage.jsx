import React, { useState } from 'react'
import { Card, CardHead, Btn, InfoBar, Chip, EmptyState } from './ui.jsx'
import CourtCard from './CourtCard.jsx'
import PlayerPicker from './PlayerPicker.jsx'
import { usedInRound, makeRound, shuffle, allSlots } from './helpers.js'
import { useToast } from './Toast.jsx'

export default function TeamsPage({ state, setState }) {
  const toast = useToast()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState(null)

  const { session, rounds, cur } = state
  if (!session) {
    return (
      <div style={{ animation:'pageIn .24s ease' }}>
        <EmptyState title="NO SESSION" subtitle="Go to Setup tab and click Start Session" />
      </div>
    )
  }

  const round = rounds[cur]
  const slots = allSlots(session.players)  // flat expanded slot names

  function updateState(updater) {
    setState(prev => {
      const next = updater(JSON.parse(JSON.stringify(prev)))
      return next
    })
  }

  function openPicker(ci, team, si, currentVal) {
    setPickerTarget({ ci, team, si, currentVal })
    setPickerOpen(true)
  }
  function closePicker() { setPickerOpen(false); setPickerTarget(null) }

  function assignPlayer(name) {
    const { ci, team, si } = pickerTarget
    updateState(s => {
      s.rounds[s.cur].courts[ci][team][si] = name
      return s
    })
    closePicker()
  }

  function clearSlot(ci, team, si) {
    updateState(s => { s.rounds[s.cur].courts[ci][team][si] = null; return s })
  }

  function handleDrop(e, ci, team) {
    const name = e.dataTransfer.getData('player')
    if (!name) return
    const used = usedInRound(round)
    if (used.has(name)) { toast('Player already in this round!', 'err'); return }
    const arr  = round.courts[ci][team]
    const slot = arr.findIndex(p => !p)
    if (slot === -1) { toast(`Team ${team} is full!`, 'err'); return }
    updateState(s => { s.rounds[s.cur].courts[ci][team][slot] = name; return s })
  }

  function addRound() {
    updateState(s => {
      s.rounds.push(makeRound(session.courts))
      s.cur = s.rounds.length - 1
      return s
    })
    toast(`Round ${rounds.length + 1} added`)
  }

  function randomTeams() {
    const names = shuffle(slots)
    updateState(s => {
      let idx = 0
      s.rounds[s.cur].courts.forEach(c => {
        c.A = [names[idx] || null, names[idx+1] || null]
        c.B = [names[idx+2] || null, names[idx+3] || null]
        idx += 4
      })
      return s
    })
    toast('Teams randomized!')
  }

  function confirmResetDay() {
    if (!confirm('Reset all rounds? Player list is kept.')) return
    updateState(s => { s.rounds = [makeRound(session.courts)]; s.cur = 0; return s })
    toast('Rounds reset!')
  }

  const used = usedInRound(round)
  const d = new Date(session.date + 'T00:00:00')

  const historyRounds = rounds
    .map((r, i) => ({ r, i }))
    .filter(({ i }) => i !== cur)
    .filter(({ r }) => r.courts.some(c => [...c.A, ...c.B].some(Boolean)))

  return (
    <div style={{ animation:'pageIn .24s ease' }}>
      <InfoBar items={[
        { label:'Date', value:`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}` },
        { label:'Players', value:session.total },
        { label:'Courts', value:session.courts },
        { label:'Round', value:`${cur+1}/${rounds.length}` },
      ]} />

      {/* Actions */}
      <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:14 }}>
        <Btn size="sm" variant="outline" onClick={addRound}>+ Round</Btn>
        <Btn size="sm" variant="ghost"   onClick={randomTeams}>Random Teams</Btn>
        <Btn size="sm" variant="ghost"   onClick={confirmResetDay}>Reset Day</Btn>
      </div>

      {/* Round pills */}
      <div style={{
        display:'flex', gap:6, overflowX:'auto', paddingBottom:4, marginBottom:14,
        WebkitOverflowScrolling:'touch', scrollbarWidth:'none',
      }}>
        {rounds.map((_, i) => (
          <div key={i} onClick={() => setState(s => ({...s, cur:i}))}
            style={{
              flexShrink:0, padding:'6px 16px', borderRadius:100,
              background: i===cur ? '#0A0A0A' : '#F2F2F2',
              border: i===cur ? '1.5px solid #0A0A0A' : '1.5px solid transparent',
              color: i===cur ? '#fff' : '#555',
              fontSize:12, fontWeight:600, letterSpacing:'0.5px',
              cursor:'pointer', transition:'all .14s',
              userSelect:'none', WebkitTapHighlightColor:'transparent',
            }}
          >Round {i+1}</div>
        ))}
      </div>

      {/* Courts */}
      {round && round.courts.map((court, ci) => (
        <CourtCard key={ci} rounds={rounds} ri={cur} ci={ci} court={court}
          onSlotClick={openPicker} onSlotClear={clearSlot} onDrop={handleDrop} />
      ))}

      {/* Player pool — expanded slots */}
      <Card>
        <CardHead left={`Player Slots — ${slots.length - used.size} available`} />
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {slots.map((name, i) => (
            <Chip key={i} used={used.has(name)}
              onDragStart={e => e.dataTransfer.setData('player', name)}>
              {name}
            </Chip>
          ))}
        </div>
      </Card>

      {/* History */}
      {historyRounds.length > 0 && (
        <div style={{ marginTop:6 }}>
          {historyRounds.map(({ r, i }) => (
            <div key={i} style={{ marginBottom:13 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#999', marginBottom:7, paddingLeft:2 }}>
                Round {i+1}
              </div>
              {r.courts.map((court, ci) => {
                const a = court.A.filter(Boolean)
                const b = court.B.filter(Boolean)
                if (!a.length && !b.length) return null
                return (
                  <div key={ci} style={{
                    background:'#fff', border:'1px solid #E6E6E6', borderRadius:9,
                    padding:'9px 13px', marginBottom:5,
                    display:'flex', alignItems:'center', gap:9, fontSize:13, fontWeight:600,
                  }}>
                    <span style={{ fontSize:10, color:'#999', letterSpacing:1, fontWeight:700, minWidth:50 }}>COURT {ci+1}</span>
                    <span style={{ flex:1, color:'#0A0A0A' }}>{a.join(' + ') || '—'}</span>
                    <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:10, letterSpacing:1, color:'#C8C8C8' }}>VS</span>
                    <span style={{ flex:1, color:'#555', textAlign:'right' }}>{b.join(' + ') || '—'}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      <PlayerPicker
        open={pickerOpen} onClose={closePicker}
        target={pickerTarget} players={slots}
        usedSet={used} onAssign={assignPlayer}
        onClear={() => { const { ci, team, si } = pickerTarget; clearSlot(ci, team, si); closePicker() }}
      />
    </div>
  )
}
