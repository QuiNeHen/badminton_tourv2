import React, { useState, useEffect } from 'react'
import { Card, CardHead, Field, Input, CtaBtn, Btn, PageTitle } from './ui.jsx'
import { formatPayDate, copyText } from './helpers.js'
import { useToast } from './Toast.jsx'

export default function PaymentPage({ session }) {
  const toast = useToast()

  const [payDate,   setPayDate]   = useState('')
  const [courtFee,  setCourtFee]  = useState('')
  const [price,     setPrice]     = useState('')
  const [qty,       setQty]       = useState('')
  const [people,    setPeople]    = useState('')
  const [receiver,  setReceiver]  = useState('')
  const [result,    setResult]    = useState(null)

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
    const recv = receiver.trim().toUpperCase() || 'NGUOI THU TIEN'

    if (!n) { toast('Nhập số người!', 'err'); return }

    const shuttle = p * q
    const total   = cFee + shuttle
    const each    = Math.ceil(total / n)

    const playerLines = session
      ? session.players.map(pl => `${pl.num}. ${pl.raw}`).join('\n')
      : ''

    const exportText = [
      `@All CAU LONG ${payDate}`,
      '',
      `Tien san nuoc: ${cFee}k`,
      `Tien cau: ${q} x ${p} = ${shuttle}k`,
      '',
      `Tong ${total} / ${n} ≈ ${each}k/nguoi`,
      '',
      playerLines,
      '',
      `CK BANH ${recv} !!!`,
    ].join('\n')

    setResult({ cFee, shuttle, total, each, n, q, p, exportText, recv })
  }

  async function handleCopy() {
    if (!result) return
    await copyText(result.exportText)
    toast('Đã copy kết quả!')
  }

  return (
    <div style={{ animation:'pageIn .24s ease' }}>
      <PageTitle label="Sau buổi đánh" title="TINH TIEN" />

      <Card>
        <CardHead left="Chi phí buổi đánh" />
        <Field label="Ngày (hiển thị trong kết quả)">
          <Input value={payDate} onChange={e=>setPayDate(e.target.value)} placeholder="Thứ 3, 10/06/2025" />
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <Field label="Tiền sân + nước (k)" style={{ marginBottom:0 }}>
            <Input type="number" value={courtFee} onChange={e=>setCourtFee(e.target.value)} placeholder="120" />
          </Field>
          <Field label="Giá 1 quả cầu (k)" style={{ marginBottom:0 }}>
            <Input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="6" />
          </Field>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:13 }}>
          <Field label="Số quả đã dùng" style={{ marginBottom:0 }}>
            <Input type="number" value={qty} onChange={e=>setQty(e.target.value)} placeholder="26" />
          </Field>
          <Field label="Tổng số người" style={{ marginBottom:0 }}>
            <Input type="number" value={people} onChange={e=>setPeople(e.target.value)} placeholder="9" />
          </Field>
        </div>
        <Field label="Tên người nhận chuyển khoản" style={{ marginTop:13 }}>
          <Input value={receiver} onChange={e=>setReceiver(e.target.value)} placeholder="PHÚ QUÍ" />
        </Field>
        <div style={{ marginTop:14 }}>
          <CtaBtn onClick={calculate}>TINH TIEN NGAY</CtaBtn>
        </div>
      </Card>

      {result && (
        <>
          <Card>
            <CardHead left="Kết quả" />
            {/* Breakdown table */}
            <div style={{ border:'1px solid #E6E6E6', borderRadius:8, overflow:'hidden' }}>
              {[
                { key:`Tiền sân + nước`, val:`${result.cFee}k` },
                { key:`Tiền cầu (${result.q} × ${result.p}k)`, val:`${result.shuttle}k` },
                { key:`Tổng cộng`, val:`${result.total}k` },
              ].map((row, i) => (
                <div key={i} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'11px 15px', borderBottom:'1px solid #E6E6E6', fontSize:14,
                }}>
                  <span style={{ color:'#555', fontSize:13 }}>{row.key}</span>
                  <span style={{ fontWeight:700, fontFamily:'DM Mono,monospace' }}>{row.val}</span>
                </div>
              ))}
              {/* Big total */}
              <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'14px 15px',
                background:'#0A0A0A', color:'#fff',
                fontFamily:'Bebas Neue,sans-serif', fontSize:24, letterSpacing:1,
              }}>
                <span>Mỗi người</span>
                <span>~{result.each}k</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead left="Nội dung gửi nhóm" />
            <div style={{
              background:'#0A0A0A', color:'#fff', borderRadius:10,
              padding:18, fontFamily:'DM Mono,monospace', fontSize:13,
              lineHeight:2, whiteSpace:'pre-wrap', marginBottom:12,
              letterSpacing:'0.2px',
            }}>
              {result.exportText}
            </div>
            <Btn variant="black" full size="md" onClick={handleCopy}>
              Copy kết quả
            </Btn>
          </Card>
        </>
      )}
    </div>
  )
}
