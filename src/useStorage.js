import { useState } from 'react'

const KEY = 'smash_v4'

const DEFAULT = {
  session:  null,   // { date, total, courts, players:[{raw,name,count,num,slots}] }
  rounds:   [],     // [{ courts:[{ A:[n,n], B:[n,n] }] }]
  cur:      0,
  payments: [],     // [{ id, date, sessionDate, label, courtFee, shuttle, total, each, people, receiver, payers:[{name,paid,paidAt}] }]
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      return {
        session:  p.session  || null,
        rounds:   Array.isArray(p.rounds)   ? p.rounds   : [],
        cur:      typeof p.cur === 'number' ? p.cur      : 0,
        payments: Array.isArray(p.payments) ? p.payments : [],
      }
    }
  } catch (_) {}
  return { ...DEFAULT }
}

export function useAppState() {
  const [state, setStateRaw] = useState(() => load())

  const setState = (updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch (_) {}
      return next
    })
  }

  return [state, setState]
}
