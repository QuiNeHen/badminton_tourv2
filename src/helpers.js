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

export function buildPlayers(rawList) {
  let num = 1
  return rawList
    .filter(r => r.trim())
    .map(raw => {
      const count = parseCount(raw)
      const name  = parseName(raw)
      const obj   = { raw: raw.trim(), name, count, num }
      num += count
      return obj
    })
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

  // streak on same court
  all.forEach(p => {
    let streak = 0
    for (let r = ri; r >= 0; r--) {
      const c = rounds[r].courts[ci]
      if (c && [...c.A, ...c.B].includes(p)) streak++
      else break
    }
    if (streak > 2) w.push(`"${p}" đã ở sân này ${streak} round liên tiếp`)
  })

  // same team streak
  ;[cur.A, cur.B].forEach(team => {
    const m = team.filter(Boolean)
    if (m.length < 2) return
    for (let r = Math.max(0, ri - 1); r < ri; r++) {
      const pc = rounds[r]?.courts[ci]
      if (!pc) continue
      if ([pc.A, pc.B].some(t => m.every(p => t.includes(p))))
        w.push(`${m.join(' & ')} đã cùng team nhiều round liên tiếp`)
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
  const days = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7']
  return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}
