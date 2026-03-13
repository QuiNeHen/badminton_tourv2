import React, { useState } from 'react'
import { ToastProvider } from './Toast.jsx'
import BrandStrip from './BrandStrip.jsx'
import SetupPage from './SetupPage.jsx'
import TeamsPage from './TeamsPage.jsx'
import PaymentPage from './PaymentPage.jsx'
import { useAppState } from './useStorage.js'

const TABS = [
  { id:'setup',   label:'Setup'    },
  { id:'teams',   label:'Xếp Đội' },
  { id:'payment', label:'Tính Tiền'},
]

function AppInner() {
  const [state, setState] = useAppState()
  const [activeTab, setActiveTab] = useState('setup')

  const hasSession = !!state.session

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#F9F9F9' }}>

      {/* Brand marquee */}
      <BrandStrip />

      {/* Header */}
      <header style={{
        background:'#0A0A0A', padding:'0 18px', height:56,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:200, flexShrink:0,
      }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <div style={{
            fontFamily:'Bebas Neue,sans-serif', fontSize:27,
            letterSpacing:4, color:'#F9F9F9', lineHeight:1,
          }}>
            SMASH
          </div>
          <div style={{
            fontSize:10, letterSpacing:2, color:'#666',
            textTransform:'uppercase', fontWeight:500,
          }}>
            Badminton Manager
          </div>
        </div>

        {hasSession && (
          <div style={{
            display:'flex', alignItems:'center', gap:6,
            background:'#F9F9F9', color:'#0A0A0A',
            fontSize:11, fontWeight:700, letterSpacing:1,
            textTransform:'uppercase',
            padding:'5px 12px', borderRadius:100,
          }}>
            <span style={{
              width:6, height:6, borderRadius:'50%', background:'#0A0A0A',
              animation:'pulseDot 1.4s ease-in-out infinite',
              display:'inline-block',
            }} />
            LIVE
          </div>
        )}
      </header>

      {/* Tab nav */}
      <nav style={{
        background:'#141414', display:'flex',
        position:'sticky', top:56, zIndex:190,
        borderBottom:'1px solid #242424',
        flexShrink:0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex:1, padding:'14px 6px', textAlign:'center',
              fontSize:11, fontWeight:600, letterSpacing:'1.5px',
              textTransform:'uppercase', border:'none',
              background:'transparent', cursor:'pointer',
              color: activeTab === tab.id ? '#F9F9F9' : '#666',
              borderBottom: activeTab === tab.id ? '2px solid #F9F9F9' : '2px solid transparent',
              transition:'all .18s',
              WebkitTapHighlightColor:'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{
        flex:1, maxWidth:560, width:'100%',
        margin:'0 auto', padding:'22px 15px 64px',
      }}>
        {activeTab === 'setup' && (
          <SetupPage
            state={state}
            setState={setState}
            onStarted={() => setActiveTab('teams')}
          />
        )}
        {activeTab === 'teams' && (
          <TeamsPage state={state} setState={setState} />
        )}
        {activeTab === 'payment' && (
          <PaymentPage session={state.session} />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
