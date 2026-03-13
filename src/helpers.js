/* ── Player name parsing ─────────────────────────────── */
export function parseCount(raw) {
  if (!raw?.trim()) return 1
  const m = raw.trim().match(/\s+(\d)$/)
  if (m) { const n = +m[1]; if (n > 1 && n < 9) return n }
  return 1
}

export function parseName(raw) {
  if (!raw) return ''
  const m = raw.trim().match(/^(.+?)\s+(\d)$/)
  if (m && +m[2] > 1 && +m[2] < 9) return m[1]
  return raw.trim()
}

/**
 * buildPlayers: expand "Viet Anh 3" into:
 *   { raw:'Viet Anh 3', name:'Viet Anh', count:3, num:X, slots:['Viet Anh','Viet Anh (2)','Viet Anh (3)'] }
 * Each slot is a distinct draggable player card name.
 */
export function buildPlayers(rawList) {
  let num = 1
  return rawList
    .filter(r => r.trim())
    .map(raw => {
      const count = parseCount(raw)
      const name  = parseName(raw)
      // Generate slot names: original name + "(2)", "(3)"… for extras
      const slots = Array.from({ length: count }, (_, i) =>
        i === 0 ? name : `${name} (${i + 1})`
      )
      const obj = { raw: raw.trim(), name, count, num, slots }
      num += count
      return obj
    })
}

/** Flat list of all slot names for team picker */
export function allSlots(players) {
  return players.flatMap(p => p.slots)
}

/* ── Round helpers ───────────────────────────────────── */
export function makeRound(n) {
  return {
    courts: Array.from({ length: n }, () => ({ A: [null, null], B: [null, null] }))
  }
}

export function usedInRound(round) {
  const s = new Set()
  if (!round) return s
  round.courts.forEach(c => [...c.A, ...c.B].forEach(p => p && s.add(p)))
  return s
}

/* ── Warnings ────────────────────────────────────────── */
export function getWarnings(rounds, ri, ci) {
  if (ri < 1) return []
  const w   = []
  const cur = rounds[ri].courts[ci]
  const all = [...cur.A, ...cur.B].filter(Boolean)

  all.forEach(p => {
    let streak = 0
    for (let r = ri; r >= 0; r--) {
      const c = rounds[r].courts[ci]
      if (c && [...c.A, ...c.B].includes(p)) streak++
      else break
    }
    if (streak > 2) w.push(`"${p}" has been on Court ${ci+1} for ${streak} rounds in a row`)
  })

  ;[cur.A, cur.B].forEach(team => {
    const m = team.filter(Boolean)
    if (m.length < 2) return
    for (let r = Math.max(0, ri - 1); r < ri; r++) {
      const pc = rounds[r]?.courts[ci]
      if (!pc) continue
      if ([pc.A, pc.B].some(t => m.every(p => t.includes(p))))
        w.push(`${m.join(' & ')} have been on the same team multiple rounds`)
    }
  })

  return [...new Set(w)]
}

/* ── Fisher-Yates shuffle ────────────────────────────── */
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ── Clipboard ───────────────────────────────────────── */
export function copyText(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
  return Promise.resolve()
}

/* ── Payment date label ──────────────────────────────── */
export function formatPayDate(isoDate) {
  const d    = new Date(isoDate + 'T00:00:00')
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}
