import React, { useState, useEffect } from 'react'
import { Card, CardHead, Field, Input, Btn, CtaBtn, PageTitle, Chip } from './ui.jsx'
import { buildPlayers, parseCount, parseName, formatPayDate } from './helpers.js'
import { useToast } from './Toast.jsx'

export default function SetupPage({ state, setState, onStarted }) {
  const toast = useToast()

  const [date,   setDate]   = useState(() => new Date().toISOString().split('T')[0])
  const [total,  setTotal]  = useState('')
  const [courts, setCourts] = useState('')
  const [inputs, setInputs] = useState([''])

  useEffect(() => {
    if (state.session) {
      setDate(state.session.date)
      setTotal(String(state.session.total))
      setCourts(String(state.session.courts))
      setInputs(state.session.players.map(p => p.raw))
    }
  }, [])

  // Build preview list with running numbers
  const preview = (() => {
    let num = 1
    return inputs.filter(v => v.trim()).map(raw => {
      const cnt  = parseCount(raw)
      const obj  = { raw: raw.trim(), num }
      num += cnt
      return obj
    })
  })()

  // Build expanded slot names for preview
  const expandedSlots = (() => {
    return inputs.filter(v => v.trim()).flatMap(raw => {
      const cnt  = parseCount(raw)
      const name = parseName(raw)
      return Array.from({ length: cnt }, (_, i) => i === 0 ? name : `${name} (${i + 1})`)
    })
  })()

  function updateInput(i, val) {
    setInputs(prev => { const n=[...prev]; n[i]=val; return n })
  }
  function addInput() {
    setInputs(prev => [...prev, ''])
    setTimeout(() => {
      const all = document.querySelectorAll('.player-input')
      all[all.length - 1]?.focus()
    }, 60)
  }
  function removeInput(i) {
    setInputs(prev => {
      const n = prev.filter((_, idx) => idx !== i)
      return n.length ? n : ['']
    })
  }

  function handleStart() {
    if (!date)         { toast('Enter session date!', 'err'); return }
    const c = parseInt(courts)
    if (!c || c < 1)   { toast('Enter number of courts!', 'err'); return }
    const valid = inputs.filter(v => v.trim())
    if (!valid.length) { toast('Add at least 1 player!', 'err'); return }

    const players    = buildPlayers(valid)
    const computed   = players.reduce((s, p) => s + p.count, 0)
    const totalFinal = parseInt(total) || computed

    setState(prev => {
      const rounds = prev.rounds.length
        ? prev.rounds
        : [{ courts: Array.from({ length: c }, () => ({ A:[null,null], B:[null,null] })) }]
      return { ...prev, session:{ date, total:totalFinal, courts:c, players }, rounds, cur: prev.cur || 0 }
    })

    toast('Session started!')
    setTimeout(onStarted, 350)
  }

  function handleReset() {
    if (!confirm('Reset entire session? All round data will be cleared.')) return
    setState(prev => ({ ...prev, session: null, rounds: [], cur: 0 }))
    setDate(new Date().toISOString().split('T')[0])
    setTotal(''); setCourts(''); setInputs([''])
    toast('Session reset!')
  }

  let runNum = 1
  const numberedInputs = inputs.map((val, i) => {
    const n = runNum
    runNum += parseCount(val)
    return { val, i, n }
  })

  const hasGuests = expandedSlots.length > preview.length

  return (
    <div style={{ animation:'pageIn .24s ease' }}>
      <PageTitle label="Today's Session" title="SETUP" />

      <Card>
        <CardHead left="Session Info" />
        <Field label="Date">
          <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <Field label="Total Players" style={{ marginBottom:0 }}>
            <Input type="number" value={total} onChange={e=>setTotal(e.target.value)} placeholder="9" />
          </Field>
          <Field label="Courts Booked" style={{ marginBottom:0 }}>
            <Input type="number" value={courts} onChange={e=>setCourts(e.target.value)} placeholder="2" />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHead
          left="Player List"
          right={
            <Btn size="xs" variant="ghost" onClick={()=>{ if(confirm('Clear all players?')) setInputs(['']) }}>
              Clear all
            </Btn>
          }
        />
        <div style={{
          fontSize:12, color:'#888', marginBottom:12, lineHeight:1.7,
          background:'#F9F9F9', borderRadius:8, padding:'8px 12px',
          border:'1px solid #F0F0F0',
        }}>
          Tip: add a number after a name for guests.<br/>
          <strong style={{color:'#444'}}>"Viet Anh 3"</strong> → creates 3 slots: <em>Viet Anh</em>, <em>Viet Anh (2)</em>, <em>Viet Anh (3)</em>
        </div>

        {numberedInputs.map(({ val, i, n }) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7, animation:'rowIn .14s ease' }}>
            <div style={{
              minWidth:26, height:26, borderRadius:6, background:'#F2F2F2',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:11, fontWeight:700, color:'#555',
              fontFamily:'DM Mono,monospace', flexShrink:0,
            }}>{n}</div>
            <input
              className="player-input"
              type="text"
              value={val}
              placeholder="Name (e.g. Viet Anh 2)"
              onChange={e => updateInput(i, e.target.value)}
              style={{
                flex:1, background:'#F9F9F9', border:'1.5px solid #E6E6E6',
                borderRadius:8, color:'#0A0A0A', padding:'10px 12px',
                fontSize:15, fontFamily:'DM Sans,sans-serif', fontWeight:500,
                outline:'none', WebkitAppearance:'none', transition:'border-color .14s',
              }}
              onFocus={e=>{ e.target.style.borderColor='#0A0A0A'; e.target.style.background='#fff' }}
              onBlur={e=>{ e.target.style.borderColor='#E6E6E6'; e.target.style.background='#F9F9F9' }}
            />
            <button
              onClick={() => removeInput(i)}
              style={{
                width:34, height:34, borderRadius:7, background:'transparent',
                border:'1.5px solid #E6E6E6', color:'#999', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:16, flexShrink:0, transition:'all .14s',
              }}
              onMouseOver={e=>{ e.currentTarget.style.borderColor='#FCA5A5'; e.currentTarget.style.color='#991B1B' }}
              onMouseOut={e=>{ e.currentTarget.style.borderColor='#E6E6E6'; e.currentTarget.style.color='#999' }}
            >×</button>
          </div>
        ))}
        <div style={{ marginTop:10 }}>
          <Btn variant="outline" full onClick={addInput}>+ Add Player</Btn>
        </div>
      </Card>

      {preview.length > 0 && (
        <Card>
          <CardHead left={`Preview — ${expandedSlots.length} slots total`} />
          {/* Original entries with numbering */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {preview.map((p, i) => (
              <Chip key={i} style={{ cursor:'default' }}>
                {p.num}. {p.raw}
              </Chip>
            ))}
          </div>

          {/* Show expanded slots when guests exist */}
          {hasGuests && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #F0F0F0' }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:1, color:'#999', textTransform:'uppercase', marginBottom:8 }}>
                Team Slots (for scheduling)
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {expandedSlots.map((s, i) => (
                  <div key={i} style={{
                    padding:'5px 12px', borderRadius:100,
                    border:'1.5px solid #E6E6E6', background:'#F9F9F9',
                    fontSize:12, fontWeight:600, color:'#555',
                  }}>{s}</div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      <div style={{ marginTop:14 }}>
        <CtaBtn onClick={handleStart}>START SESSION</CtaBtn>
      </div>
      <div style={{ marginTop:10 }}>
        <Btn variant="danger" full onClick={handleReset}>Reset Session</Btn>
      </div>
    </div>
  )
}
