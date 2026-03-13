import React, { useState, useEffect } from 'react'
import { Card, CardHead, Field, Input, Btn, CtaBtn, PageTitle, Chip } from './ui.jsx'
import { buildPlayers, parseCount, formatPayDate } from './helpers.js'
import { useToast } from './Toast.jsx'

export default function SetupPage({ state, setState, onStarted }) {
  const toast = useToast()

  // Local form state
  const [date,   setDate]   = useState(() => new Date().toISOString().split('T')[0])
  const [total,  setTotal]  = useState('')
  const [courts, setCourts] = useState('')
  const [inputs, setInputs] = useState([''])

  // Restore from saved session
  useEffect(() => {
    if (state.session) {
      setDate(state.session.date)
      setTotal(String(state.session.total))
      setCourts(String(state.session.courts))
      setInputs(state.session.players.map(p => p.raw))
    }
  }, [])

  // Compute numbered preview
  const preview = (() => {
    let num = 1
    return inputs
      .filter(v => v.trim())
      .map(raw => {
        const cnt = parseCount(raw)
        const obj = { raw: raw.trim(), num }
        num += cnt
        return obj
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
    if (!date)                 { toast('Nhập ngày đánh!', 'err'); return }
    const c = parseInt(courts)
    if (!c || c < 1)           { toast('Nhập số sân!', 'err'); return }
    const valid = inputs.filter(v => v.trim())
    if (!valid.length)         { toast('Thêm ít nhất 1 người!', 'err'); return }

    const players    = buildPlayers(valid)
    const computed   = players.reduce((s, p) => s + p.count, 0)
    const totalFinal = parseInt(total) || computed

    const newSession = { date, total: totalFinal, courts: c, players }

    setState(prev => {
      const rounds = prev.rounds.length
        ? prev.rounds
        : [{ courts: Array.from({ length: c }, () => ({ A:[null,null], B:[null,null] })) }]
      return { ...prev, session: newSession, rounds, cur: prev.cur || 0 }
    })

    toast('Session bắt đầu!')
    setTimeout(onStarted, 350)
  }

  function handleReset() {
    if (!confirm('Reset toàn bộ session? Tất cả dữ liệu sẽ bị xóa.')) return
    setState({ session: null, rounds: [], cur: 0 })
    setDate(new Date().toISOString().split('T')[0])
    setTotal(''); setCourts(''); setInputs([''])
    toast('Đã reset!')
  }

  // Numbered counter for each row
  let runNum = 1
  const numberedInputs = inputs.map((val, i) => {
    const n = runNum
    runNum += parseCount(val)
    return { val, i, n }
  })

  return (
    <div style={{ animation:'pageIn .24s ease' }}>
      <PageTitle label="Buổi đánh hôm nay" title="SETUP SESSION" />

      {/* Session info */}
      <Card>
        <CardHead left="Thông tin chung" />
        <Field label="Ngày đánh">
          <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <Field label="Tổng số người" style={{ marginBottom:0 }}>
            <Input type="number" value={total} onChange={e=>setTotal(e.target.value)} placeholder="9" />
          </Field>
          <Field label="Số sân đặt" style={{ marginBottom:0 }}>
            <Input type="number" value={courts} onChange={e=>setCourts(e.target.value)} placeholder="2" />
          </Field>
        </div>
      </Card>

      {/* Player list */}
      <Card>
        <CardHead
          left="Danh sách người chơi"
          right={
            <Btn size="xs" variant="ghost" onClick={()=>{ if(confirm('Xóa hết?')) setInputs(['']) }}>
              Xóa hết
            </Btn>
          }
        />
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
              placeholder="Tên (VD: Việt Anh 2)"
              onChange={e => updateInput(i, e.target.value)}
              style={{
                flex:1, background:'#F9F9F9', border:'1.5px solid #E6E6E6',
                borderRadius:8, color:'#0A0A0A', padding:'10px 12px',
                fontSize:15, fontFamily:'DM Sans,sans-serif', fontWeight:500,
                outline:'none', WebkitAppearance:'none',
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
          <Btn variant="outline" full onClick={addInput}>+ Thêm người chơi</Btn>
        </div>
      </Card>

      {/* Preview */}
      {preview.length > 0 && (
        <Card>
          <CardHead left="Xem trước danh sách" />
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {preview.map((p, i) => (
              <Chip key={i} style={{ cursor:'default' }}>
                {p.num}. {p.raw}
              </Chip>
            ))}
          </div>
        </Card>
      )}

      <div style={{ marginTop:14 }}>
        <CtaBtn onClick={handleStart}>BAT DAU BUOI DANH</CtaBtn>
      </div>
      <div style={{ marginTop:10 }}>
        <Btn variant="danger" full onClick={handleReset}>Reset toàn bộ session</Btn>
      </div>
    </div>
  )
}
