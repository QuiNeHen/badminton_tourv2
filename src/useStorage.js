import { useState, useEffect } from 'react'

const KEY = 'smash_v3'

const DEFAULT = {
  session: null,   // { date, total, courts, players:[{raw,name,count,num}] }
  rounds:  [],     // [{ courts:[{ A:[n,n], B:[n,n] }] }]
  cur:     0,
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        session: parsed.session || null,
        rounds:  Array.isArray(parsed.rounds) ? parsed.rounds : [],
        cur:     typeof parsed.cur === 'number' ? parsed.cur : 0,
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
