import React, { useState, useEffect } from 'react'
import { Card, CardHead, Field, Input, CtaBtn, Btn, PageTitle, Divider } from './ui.jsx'
import { formatPayDate, copyText, allSlots } from './helpers.js'
import { useToast } from './Toast.jsx'

/* ── Helper ── */
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6) }

/* ── PayerRow — individual tick-off row ── */
function PayerRow({ payer, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'10px 14px',
        background: payer.paid ? '#F9FFF9' : '#fff',
        borderBottom:'1px solid #F0F0F0',
        cursor:'pointer',
        transition:'background .15s',
        userSelect:'none',
        WebkitTapHighlightColor:'transparent',
      }}
    >
      {/* Checkbox */}
      <div style={{
        width:22, height:22, borderRadius:6, flexShrink:0,
        border: payer.paid ? 'none' : '2px solid #C8C8C8',
        background: payer.paid ? '#0A0A0A' : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all .14s',
      }}>
        {payer.paid && <span style={{ color:'#fff', fontSize:13, lineHeight:1 }}>✓</span>}
      </div>
      <span style={{
        flex:1, fontSize:14, fontWeight:600,
        color: payer.paid ? '#999' : '#0A0A0A',
        textDecoration: payer.paid ? 'line-through' : 'none',
        transition:'all .14s',
      }}>
        {payer.name}
      </span>
      {payer.paid && payer.paidAt && (
        <span style={{ fontSize:11, color:'#BBB', fontFamily:'DM Mono,monospace' }}>
          {payer.paidAt}
        </span>
      )}
    </div>
  )
}

/* ── SessionRecord — one collapsed/expanded payment record ── */
function SessionRecord({ record, onTogglePayer, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const paidCount = record.payers.filter(p => p.paid).length
  const total = record.payers.length
  const allPaid = paidCount === total

  return (
    <div style={{
      border:'1px solid #E6E6E6', borderRadius:12, overflow:'hidden',
      marginBottom:10, background:'#fff',
      boxShadow:'0 1px 3px rgba(0,0,0,0.05)',
    }}>
      {/* Header row — tap to expand */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding:'13px 15px', cursor:'pointer',
          display:'flex', alignItems:'center', gap:10,
          background: allPaid ? '#F9FFF9' : '#fff',
          userSelect:'none',
        }}
      >
        {/* Status pill */}
        <div style={{
          padding:'3px 10px', borderRadius:100, fontSize:10, fontWeight:700, letterSpacing:1,
          background: allPaid ? '#D1FAE5' : '#F3F4F6',
          color: allPaid ? '#065F46' : '#555',
          flexShrink:0,
        }}>
          {allPaid ? 'SETTLED' : `${paidCount}/${total}`}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#0A0A0A' }}>{record.label}</div>
          <div style={{ fontSize:11, color:'#999', marginTop:2 }}>
            {record.date} · ~{record.each}k/person · {record.people} players
          </div>
        </div>
        <div style={{ fontSize:15, fontWeight:700, fontFamily:'DM Mono,monospace', color:'#0A0A0A', flexShrink:0 }}>
          {record.total}k
        </div>
        <div style={{ fontSize:16, color:'#BBB', flexShrink:0 }}>
          {expanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Expanded payer list */}
      {expanded && (
        <div>
          <div style={{ borderTop:'1px solid #F0F0F0' }}>
            <div style={{
              padding:'8px 14px', fontSize:10, fontWeight:700, letterSpacing:2,
              color:'#AAA', textTransform:'uppercase', background:'#FAFAFA',
              display:'flex', justifyContent:'space-between', alignItems:'center',
            }}>
              <span>Tap name to mark as paid</span>
              <span>{paidCount}/{total} paid</span>
            </div>
            {record.payers.map((payer, i) => (
              <PayerRow key={i} payer={payer} onToggle={() => onTogglePayer(record.id, i)} />
            ))}
          </div>
          {/* Summary row */}
          <div style={{ padding:'10px 15px', background:'#FAFAFA', borderTop:'1px solid #F0F0F0', display:'flex', gap:16, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'#555' }}>Court: <strong>{record.courtFee}k</strong></span>
            <span style={{ fontSize:12, color:'#555' }}>Shuttlecock: <strong>{record.shuttleQty}×{record.shuttlePrice}k = {record.shuttle}k</strong></span>
            <span style={{ fontSize:12, color:'#555' }}>Receiver: <strong>{record.receiver}</strong></span>
          </div>
          <div style={{ padding:'8px 14px 12px', borderTop:'1px solid #F0F0F0' }}>
            <Btn size="xs" variant="danger" onClick={() => { if(confirm('Delete this record?')) onDelete(record.id) }}>
              Delete record
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main PaymentPage ── */
export default function PaymentPage({ session, payments, setState }) {
  const toast = useToast()

  const [payDate,  setPayDate]  = useState('')
  const [courtFee, setCourtFee] = useState('')
  const [price,    setPrice]    = useState('')
  const [qty,      setQty]      = useState('')
  const [people,   setPeople]   = useState('')
  const [receiver, setReceiver] = useState('')
  const [result,   setResult]   = useState(null)

  useEffect(() => {
    if (session) {
      setPayDate(formatPayDate(session.date))
      setPeople(String(session.total))
    }
  }, [session])

  function calculate() {
    const cFee = parseFloat(courtFee) || 0
    const p    = parseFloat(price)    || 0
    const q    = parseInt(qty)        || 0
    const n    = parseInt(people)     || 0
    const recv = receiver.trim().toUpperCase() || 'RECEIVER'
    if (!n) { toast('Enter number of players!', 'err'); return }

    const shuttle = p * q
    const total   = cFee + shuttle
    const each    = Math.ceil(total / n)

    const playerLines = session
      ? session.players.map(pl => `${pl.num}. ${pl.raw}`).join('\n')
      : ''

    const exportText = [
      `@All BADMINTON ${payDate}`,
      '',
      `Court + water: ${cFee}k`,
      `Shuttlecock: ${q} x ${p} = ${shuttle}k`,
      '',
      `Total ${total} / ${n} ≈ ${each}k/person`,
      '',
      playerLines,
      '',
      `TRANSFER TO ${recv} !!!`,
    ].join('\n')

    setResult({ cFee, shuttle, total, each, n, q, p, exportText, recv, payDate })
  }

  function saveRecord() {
    if (!result) return
    // Build payer list from session slots or generic numbers
    const names = session
      ? allSlots(session.players)
      : Array.from({ length: result.n }, (_, i) => `Player ${i+1}`)

    const record = {
      id:           genId(),
      date:         result.payDate,
      sessionDate:  session?.date || '',
      label:        `Badminton ${result.payDate}`,
      courtFee:     result.cFee,
      shuttlePrice: result.p,
      shuttleQty:   result.q,
      shuttle:      result.shuttle,
      total:        result.total,
      each:         result.each,
      people:       result.n,
      receiver:     result.recv,
      payers:       names.slice(0, result.n).map(name => ({ name, paid:false, paidAt:null })),
    }

    setState(prev => ({ ...prev, payments: [record, ...prev.payments] }))
    toast('Payment record saved!')
  }

  function togglePayer(recordId, payerIdx) {
    setState(prev => {
      const payments = prev.payments.map(r => {
        if (r.id !== recordId) return r
        const payers = r.payers.map((p, i) => {
          if (i !== payerIdx) return p
          const nowPaid = !p.paid
          const d = new Date()
          return {
            ...p,
            paid: nowPaid,
            paidAt: nowPaid
              ? `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`
              : null,
          }
        })
        return { ...r, payers }
      })
      return { ...prev, payments }
    })
  }

  function deleteRecord(id) {
    setState(prev => ({ ...prev, payments: prev.payments.filter(r => r.id !== id) }))
    toast('Record deleted')
  }

  async function handleCopy() {
    if (!result) return
    await copyText(result.exportText)
    toast('Copied!')
  }

  const safePayments = Array.isArray(payments) ? payments : []

  return (
    <div style={{ animation:'pageIn .24s ease' }}>
      <PageTitle label="After the session" title="PAYMENT" />

      {/* Calculator */}
      <Card>
        <CardHead left="Session Costs" />
        <Field label="Date label (shown in result)">
          <Input value={payDate} onChange={e=>setPayDate(e.target.value)} placeholder="Tue 10/06/2025" />
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <Field label="Court + water (k)" style={{ marginBottom:0 }}>
            <Input type="number" value={courtFee} onChange={e=>setCourtFee(e.target.value)} placeholder="120" />
          </Field>
          <Field label="Price per shuttlecock (k)" style={{ marginBottom:0 }}>
            <Input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="6" />
          </Field>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:13 }}>
          <Field label="Shuttlecocks used" style={{ marginBottom:0 }}>
            <Input type="number" value={qty} onChange={e=>setQty(e.target.value)} placeholder="26" />
          </Field>
          <Field label="Total players" style={{ marginBottom:0 }}>
            <Input type="number" value={people} onChange={e=>setPeople(e.target.value)} placeholder="9" />
          </Field>
        </div>
        <Field label="Transfer receiver name" style={{ marginTop:13 }}>
          <Input value={receiver} onChange={e=>setReceiver(e.target.value)} placeholder="PHU QUI" />
        </Field>
        <div style={{ marginTop:14 }}>
          <CtaBtn onClick={calculate}>CALCULATE</CtaBtn>
        </div>
      </Card>

      {/* Result */}
      {result && (
        <>
          <Card>
            <CardHead left="Breakdown" />
            <div style={{ border:'1px solid #E6E6E6', borderRadius:8, overflow:'hidden' }}>
              {[
                { key:'Court + water',                      val:`${result.cFee}k` },
                { key:`Shuttlecock (${result.q} × ${result.p}k)`, val:`${result.shuttle}k` },
                { key:'Total',                              val:`${result.total}k` },
              ].map((row, i) => (
                <div key={i} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'11px 15px', borderBottom:'1px solid #E6E6E6', fontSize:14,
                }}>
                  <span style={{ color:'#555', fontSize:13 }}>{row.key}</span>
                  <span style={{ fontWeight:700, fontFamily:'DM Mono,monospace' }}>{row.val}</span>
                </div>
              ))}
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'14px 15px', background:'#0A0A0A', color:'#fff',
                fontFamily:'Bebas Neue,sans-serif', fontSize:24, letterSpacing:1,
              }}>
                <span>Per person</span>
                <span>~{result.each}k</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead left="Share to group" />
            <div style={{
              background:'#0A0A0A', color:'#fff', borderRadius:10,
              padding:18, fontFamily:'DM Mono,monospace', fontSize:13,
              lineHeight:2, whiteSpace:'pre-wrap', marginBottom:12,
            }}>
              {result.exportText}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn variant="black" full onClick={handleCopy}>Copy result</Btn>
              <Btn variant="outline" full onClick={saveRecord}>Save record</Btn>
            </div>
          </Card>
        </>
      )}

      {/* ── Payment History ── */}
      <div style={{ marginTop:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2.5px', color:'#999', textTransform:'uppercase', marginBottom:4 }}>
              Persistent across resets
            </div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:28, letterSpacing:2, color:'#0A0A0A', lineHeight:1 }}>
              PAYMENT HISTORY
            </div>
          </div>
          {safePayments.length > 0 && (
            <Btn size="xs" variant="ghost" onClick={() => { if(confirm('Clear ALL payment history?')) setState(prev => ({...prev, payments:[]})) }}>
              Clear all
            </Btn>
          )}
        </div>

        {safePayments.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'32px 16px',
            border:'1.5px dashed #E6E6E6', borderRadius:12,
            color:'#BBB', fontSize:13,
          }}>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:2, marginBottom:6 }}>NO RECORDS YET</div>
            Calculate a session above then click <strong>Save record</strong>
          </div>
        ) : (
          safePayments.map(record => (
            <SessionRecord
              key={record.id}
              record={record}
              onTogglePayer={togglePayer}
              onDelete={deleteRecord}
            />
          ))
        )}
      </div>
    </div>
  )
}
