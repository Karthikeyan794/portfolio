/**
 * Draws the bento covers.
 *
 * The old ones were painted illustrations copied out of the labs-client repo
 * as placeholders — somebody else's artwork on a personal site, which is not
 * something to publish. These are drawn here instead, so they are ours, they
 * weigh a few KB each instead of 350, and they stay crisp at any size.
 *
 * They are abstractions of each project rather than pictures of it: a queue of
 * rows, a field of readings, a dial, a week. A portfolio grid of sixteen
 * photographs competes with itself; sixteen quiet diagrams read as one set and
 * let the titles do the talking.
 *
 * Run: node scripts/make-covers.mjs
 *
 * The hard part is that one drawing has to survive every tile shape. The grid
 * runs from about 4:1 (the wide feature tile) to nearly square, and
 * `object-fit: cover` crops whatever does not fit — a 4:1 tile keeps only the
 * middle 350px of these 1000, and `.box__veil` then darkens the bottom of
 * whatever is left so the title can sit on it.
 *
 * Intersect those and the band that is reliably visible and reliably light is
 * roughly y 325-600. So each motif is drawn at a comfortable size and then
 * scaled toward the middle by SAFE, rather than every motif being redrawn
 * small: the arithmetic lives in one place, and the drawings stay readable.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'bento')
const W = 1400
const H = 1000
const ACCENT = '#a6e85b'
/** pulls a motif into the band that survives the widest tile's crop */
const SAFE = 0.62
const SAFE_Y = 455

/* ── the shared shell ───────────────────────────────────────────────────── */

/** deterministic pseudo-random, so a re-run produces identical files */
function rng(seed) {
  let s = seed
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
}

function shell(id, top, bottom, glow, body, zoom = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="0.5" cy="0.34" r="0.62">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="${glow}" stop-opacity="0.12"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig-${id}" cx="0.5" cy="0.42" r="0.78">
      <stop offset="0.45" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="soft-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#glow-${id})"/>
  <g transform="translate(${W / 2} ${SAFE_Y}) scale(${(SAFE * zoom).toFixed(3)}) translate(${-W / 2} -410)">
${body}
  </g>
  <rect width="${W}" height="${H}" fill="url(#vig-${id})"/>
  <rect width="${W}" height="${H}" filter="url(#grain-${id})" opacity="0.06"/>
</svg>
`
}

/* ── the motifs ─────────────────────────────────────────────────────────── */

/** a queue of rows, one of them live — Support Desk */
function queue(id) {
  const rows = []
  for (let i = 0; i < 7; i++) {
    const y = 250 + i * 62
    const o = 0.3 - i * 0.03
    const w = 620 - (i % 3) * 70
    rows.push(
      `<rect x="330" y="${y}" width="${w}" height="34" rx="17" fill="#fff" opacity="${o.toFixed(3)}"/>`,
      `<circle cx="292" cy="${y + 17}" r="7" fill="#fff" opacity="${(o + 0.12).toFixed(3)}"/>`,
    )
  }
  // the one being worked on
  rows.push(
    `<rect x="318" y="298" width="700" height="50" rx="25" fill="${ACCENT}" opacity="0.14"/>`,
    `<rect x="330" y="312" width="560" height="34" rx="17" fill="${ACCENT}" opacity="0.85"/>`,
    `<circle cx="292" cy="329" r="9" fill="${ACCENT}"/>`,
  )
  return rows.join('\n  ')
}

/** concentric readings around one nucleus — Atom */
function orbit(id) {
  const out = [`<circle cx="700" cy="400" r="300" fill="${ACCENT}" opacity="0.05" filter="url(#soft-${id})"/>`]
  for (let i = 0; i < 5; i++) {
    const r = 92 + i * 52
    out.push(
      `<ellipse cx="700" cy="400" rx="${r}" ry="${(r * 0.42).toFixed(0)}" fill="none" stroke="#fff" stroke-width="1.5" opacity="${(0.3 - i * 0.045).toFixed(3)}" transform="rotate(${i * 36} 700 400)"/>`,
    )
  }
  const r2 = rng(11)
  for (let i = 0; i < 7; i++) {
    const a = r2() * Math.PI * 2
    const d = 110 + r2() * 180
    out.push(
      `<circle cx="${(700 + Math.cos(a) * d).toFixed(0)}" cy="${(400 + Math.sin(a) * d * 0.5).toFixed(0)}" r="${(2 + r2() * 3).toFixed(1)}" fill="#fff" opacity="0.5"/>`,
    )
  }
  out.push(
    `<circle cx="700" cy="400" r="46" fill="${ACCENT}" opacity="0.16"/>`,
    `<circle cx="700" cy="400" r="17" fill="${ACCENT}"/>`,
  )
  return out.join('\n  ')
}

/** readings that turn into a finding — the Atom slice */
function scatter(id) {
  const out = []
  const r = rng(29)
  for (let i = 0; i < 46; i++) {
    const x = 300 + r() * 800
    const y = 560 - ((x - 300) / 800) * 260 + (r() - 0.5) * 150
    out.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + r() * 4).toFixed(1)}" fill="#fff" opacity="${(0.18 + r() * 0.3).toFixed(3)}"/>`)
  }
  out.push(
    `<path d="M300 545 C 520 480, 680 400, 1100 292" fill="none" stroke="${ACCENT}" stroke-width="3" opacity="0.9" stroke-linecap="round"/>`,
    `<circle cx="1100" cy="292" r="11" fill="${ACCENT}"/>`,
    `<circle cx="1100" cy="292" r="26" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.4"/>`,
  )
  // the axis it is read against
  out.push(
    `<line x1="280" y1="592" x2="1140" y2="592" stroke="#fff" stroke-width="1.5" opacity="0.2"/>`,
    `<line x1="280" y1="200" x2="280" y2="592" stroke="#fff" stroke-width="1.5" opacity="0.2"/>`,
  )
  return out.join('\n  ')
}

/** a question, an answer offered, a person deciding — Skill Mate */
function bubbles(id) {
  return [
    `<rect x="300" y="210" width="430" height="104" rx="30" fill="#fff" opacity="0.16"/>`,
    `<rect x="332" y="248" width="300" height="12" rx="6" fill="#fff" opacity="0.4"/>`,
    `<rect x="332" y="274" width="200" height="12" rx="6" fill="#fff" opacity="0.26"/>`,

    `<rect x="560" y="352" width="500" height="150" rx="34" fill="${ACCENT}" opacity="0.14"/>`,
    `<rect x="560" y="352" width="500" height="150" rx="34" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.5"/>`,
    `<rect x="596" y="392" width="380" height="12" rx="6" fill="${ACCENT}" opacity="0.75"/>`,
    `<rect x="596" y="420" width="330" height="12" rx="6" fill="${ACCENT}" opacity="0.5"/>`,
    `<rect x="596" y="448" width="220" height="12" rx="6" fill="${ACCENT}" opacity="0.3"/>`,

    `<rect x="300" y="540" width="340" height="86" rx="26" fill="#fff" opacity="0.1"/>`,
    `<rect x="330" y="574" width="210" height="12" rx="6" fill="#fff" opacity="0.3"/>`,
    // the cursor that edits it before it goes
    `<path d="M1010 470 l 0 62 l 16 -17 l 12 27 l 13 -6 l -12 -26 l 23 -3 z" fill="#fff" opacity="0.92"/>`,
  ].join('\n  ')
}

/** two dials and a readout — Car Dashboard */
function gauge(id) {
  const arc = (cx, cy, r, from, to, stroke, w, o) => {
    const p = (a) => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r]
    const [x1, y1] = p(from)
    const [x2, y2] = p(to)
    const large = to - from > 180 ? 1 : 0
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${w}" opacity="${o}" stroke-linecap="round"/>`
  }
  return [
    arc(700, 430, 250, 145, 395, '#fff', 3, 0.14),
    arc(700, 430, 250, 145, 300, ACCENT, 8, 0.9),
    arc(700, 430, 196, 150, 390, '#fff', 1.5, 0.1),
    arc(440, 470, 120, 150, 390, '#fff', 2.5, 0.12),
    arc(440, 470, 120, 150, 280, '#fff', 5, 0.45),
    arc(960, 470, 120, 150, 390, '#fff', 2.5, 0.12),
    arc(960, 470, 120, 150, 250, '#fff', 5, 0.3),
    // the needle
    `<line x1="700" y1="430" x2="${(700 + Math.cos((300 * Math.PI) / 180) * 214).toFixed(0)}" y2="${(430 + Math.sin((300 * Math.PI) / 180) * 214).toFixed(0)}" stroke="${ACCENT}" stroke-width="4" stroke-linecap="round"/>`,
    `<circle cx="700" cy="430" r="15" fill="${ACCENT}"/>`,
    `<circle cx="700" cy="430" r="34" fill="none" stroke="${ACCENT}" stroke-width="1.5" opacity="0.35"/>`,
    // tick marks
    ...Array.from({ length: 11 }, (_, i) => {
      const a = ((145 + i * 25) * Math.PI) / 180
      const r1 = 226
      const r2 = 240
      return `<line x1="${(700 + Math.cos(a) * r1).toFixed(1)}" y1="${(430 + Math.sin(a) * r1).toFixed(1)}" x2="${(700 + Math.cos(a) * r2).toFixed(1)}" y2="${(430 + Math.sin(a) * r2).toFixed(1)}" stroke="#fff" stroke-width="2" opacity="0.28"/>`
    }),
  ].join('\n  ')
}

/** a public portal: heavy columns, one lit doorway — TNPSC */
function columns(id) {
  const out = [`<rect x="560" y="196" width="280" height="430" rx="6" fill="${ACCENT}" opacity="0.1"/>`]
  for (let i = 0; i < 7; i++) {
    const x = 300 + i * 132
    const h = 340 + (i % 2) * 40
    out.push(`<rect x="${x}" y="${626 - h}" width="64" height="${h}" rx="4" fill="#fff" opacity="${(0.2 - Math.abs(i - 3) * 0.028).toFixed(3)}"/>`)
  }
  out.push(
    `<rect x="264" y="212" width="872" height="26" rx="8" fill="#fff" opacity="0.26"/>`,
    `<path d="M700 150 L 1160 226 L 240 226 Z" fill="#fff" opacity="0.14"/>`,
    `<rect x="646" y="386" width="108" height="240" rx="54" fill="${ACCENT}" opacity="0.5"/>`,
  )
  return out.join('\n  ')
}

/** a dashboard of totals — POS School */
function bars(id) {
  const hs = [140, 210, 168, 286, 232, 330, 268]
  const out = []
  hs.forEach((h, i) => {
    const x = 330 + i * 110
    const lit = i === 5
    out.push(
      `<rect x="${x}" y="${600 - h}" width="62" height="${h}" rx="10" fill="${lit ? ACCENT : '#fff'}" opacity="${lit ? 0.9 : (0.14 + i * 0.022).toFixed(3)}"/>`,
    )
  })
  out.push(
    `<line x1="300" y1="612" x2="1120" y2="612" stroke="#fff" stroke-width="1.5" opacity="0.2"/>`,
    `<path d="M361 420 L 471 352 L 581 386 L 691 292 L 801 330 L 911 244" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<circle cx="911" cy="244" r="8" fill="#fff" opacity="0.7"/>`,
  )
  return out.join('\n  ')
}

/** bands on a pack — Nellai Karupatti */
function bands(id) {
  return [
    // the pack, lifted off the ground so it reads as an object at tile size
    `<rect x="492" y="216" width="416" height="424" rx="14" fill="#fff" opacity="0.13"/>`,
    `<rect x="492" y="216" width="416" height="424" rx="14" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.4"/>`,
    // the crimped top
    `<path d="M492 216 l 42 -46 l 332 0 l 42 46 z" fill="#fff" opacity="0.2"/>`,
    `<path d="M492 216 l 42 -46 l 332 0 l 42 46 z" fill="none" stroke="#fff" stroke-width="2" opacity="0.32"/>`,
    // the label band, the one loud thing
    `<rect x="492" y="330" width="416" height="126" fill="${ACCENT}" opacity="0.9"/>`,
    `<rect x="540" y="358" width="320" height="18" rx="9" fill="#12210a" opacity="0.55"/>`,
    `<rect x="580" y="392" width="240" height="12" rx="6" fill="#12210a" opacity="0.32"/>`,
    `<rect x="628" y="420" width="144" height="10" rx="5" fill="#12210a" opacity="0.22"/>`,
    // rules above and below it
    `<rect x="492" y="306" width="416" height="8" fill="#fff" opacity="0.38"/>`,
    `<rect x="492" y="474" width="416" height="6" fill="#fff" opacity="0.24"/>`,
    // a seal
    `<circle cx="700" cy="262" r="30" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.5"/>`,
    `<path d="M682 262 q 18 -22 36 0 q -18 22 -36 0 z" fill="#fff" opacity="0.55"/>`,
    `<rect x="576" y="516" width="248" height="12" rx="6" fill="#fff" opacity="0.3"/>`,
    `<rect x="620" y="544" width="160" height="10" rx="5" fill="#fff" opacity="0.2"/>`,
    // the fold down the middle
    `<rect x="688" y="170" width="24" height="470" fill="#000" opacity="0.07"/>`,
  ].join('\n  ')
}

/** seven days, one of them today — 7 Days */
function week(id) {
  const out = []
  for (let i = 0; i < 7; i++) {
    const x = 316 + i * 110
    const today = i === 3
    out.push(
      `<rect x="${x}" y="240" width="76" height="76" rx="20" fill="${today ? ACCENT : '#fff'}" opacity="${today ? 0.9 : 0.16}"/>`,
    )
    for (let j = 0; j < 4; j++) {
      const h = 14 + ((i * 7 + j * 3) % 5) * 10
      if ((i + j) % 3 === 0) continue
      out.push(
        `<rect x="${x}" y="${356 + j * 66}" width="76" height="${h}" rx="7" fill="#fff" opacity="${(0.22 - j * 0.035).toFixed(3)}"/>`,
      )
    }
  }
  out.push(`<rect x="${316 + 3 * 110 - 14}" y="226" width="104" height="400" rx="26" fill="${ACCENT}" opacity="0.08"/>`)
  return out.join('\n  ')
}

/** a click, and what it sets off — Clickly */
function cursor(id) {
  const out = []
  for (let i = 0; i < 4; i++) {
    out.push(
      `<circle cx="700" cy="390" r="${72 + i * 78}" fill="none" stroke="${ACCENT}" stroke-width="${2.5 - i * 0.45}" opacity="${(0.5 - i * 0.11).toFixed(3)}"/>`,
    )
  }
  out.push(
    `<circle cx="700" cy="390" r="30" fill="${ACCENT}" opacity="0.2"/>`,
    `<circle cx="700" cy="390" r="11" fill="${ACCENT}"/>`,
    `<path d="M700 390 l 0 118 l 30 -32 l 23 51 l 25 -12 l -23 -50 l 43 -6 z" fill="#fff"/>`,
    `<path d="M700 390 l 0 118 l 30 -32 l 23 51 l 25 -12 l -23 -50 l 43 -6 z" fill="none" stroke="#000" stroke-width="2" opacity="0.2"/>`,
  )
  return out.join('\n  ')
}

/** freehand — Drawings & Art */
function strokes(id) {
  const r = rng(53)
  const out = []
  for (let i = 0; i < 9; i++) {
    const y = 210 + i * 46
    const a = 300 + r() * 60
    const b = 1100 - r() * 60
    out.push(
      `<path d="M${a.toFixed(0)} ${y} C ${(a + 200).toFixed(0)} ${(y - 60 - r() * 50).toFixed(0)}, ${(b - 220).toFixed(0)} ${(y + 60 + r() * 50).toFixed(0)}, ${b.toFixed(0)} ${y}" fill="none" stroke="#fff" stroke-width="${(1.5 + r() * 2.5).toFixed(1)}" opacity="${(0.13 + r() * 0.2).toFixed(3)}" stroke-linecap="round"/>`,
    )
  }
  out.push(
    `<path d="M340 430 C 520 250, 760 560, 1060 330" fill="none" stroke="${ACCENT}" stroke-width="5" opacity="0.92" stroke-linecap="round"/>`,
    `<circle cx="1060" cy="330" r="10" fill="${ACCENT}"/>`,
  )
  return out.join('\n  ')
}

/** fields, labels, and one of them being filled — Form Design */
function fields(id) {
  const out = []
  for (let i = 0; i < 5; i++) {
    const y = 208 + i * 92
    const lit = i === 2
    out.push(
      `<rect x="${330 + (i % 2) * 0}" y="${y}" width="${i === 4 ? 340 : 740}" height="58" rx="14" fill="none" stroke="${lit ? ACCENT : '#fff'}" stroke-width="${lit ? 2.5 : 1.5}" opacity="${lit ? 0.9 : 0.2}"/>`,
      `<rect x="356" y="${y - 9}" width="${76 + (i % 3) * 34}" height="18" rx="9" fill="${lit ? ACCENT : '#fff'}" opacity="${lit ? 0.22 : 0.1}"/>`,
      `<rect x="362" y="${y + 22}" width="${150 + (i * 47) % 260}" height="14" rx="7" fill="#fff" opacity="${lit ? 0.5 : 0.2}"/>`,
    )
  }
  out.push(
    `<rect x="744" y="576" width="326" height="58" rx="14" fill="${ACCENT}" opacity="0.85"/>`,
    // the caret in the live field
    `<rect x="${362 + 150 + 94 + 8}" y="${208 + 2 * 92 + 18}" width="3" height="22" fill="${ACCENT}"/>`,
  )
  return out.join('\n  ')
}

/** a face on a wrist — Smartwatch */
function watch(id) {
  return [
    // strap above and below, so the case reads as worn
    `<rect x="596" y="118" width="208" height="120" rx="26" fill="#fff" opacity="0.1"/>`,
    `<rect x="596" y="566" width="208" height="120" rx="26" fill="#fff" opacity="0.08"/>`,
    // the case
    `<rect x="516" y="180" width="368" height="420" rx="104" fill="#fff" opacity="0.15"/>`,
    `<rect x="516" y="180" width="368" height="420" rx="104" fill="none" stroke="#fff" stroke-width="3" opacity="0.55"/>`,
    // the screen, darker than the case so the two separate
    `<rect x="556" y="220" width="288" height="340" rx="80" fill="#05080a" opacity="0.72"/>`,
    `<rect x="556" y="220" width="288" height="340" rx="80" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.2"/>`,
    // the activity ring
    `<circle cx="700" cy="390" r="108" fill="none" stroke="#fff" stroke-width="14" opacity="0.14"/>`,
    `<path d="M700 282 A 108 108 0 1 1 604 443" fill="none" stroke="${ACCENT}" stroke-width="14" opacity="0.95" stroke-linecap="round"/>`,
    `<circle cx="700" cy="390" r="70" fill="none" stroke="#fff" stroke-width="9" opacity="0.14"/>`,
    `<path d="M700 320 A 70 70 0 0 1 764 434" fill="none" stroke="#fff" stroke-width="9" opacity="0.6" stroke-linecap="round"/>`,
    // the readout
    `<rect x="668" y="366" width="64" height="14" rx="7" fill="#fff" opacity="0.85"/>`,
    `<rect x="660" y="396" width="80" height="9" rx="4.5" fill="#fff" opacity="0.4"/>`,
    // the crown
    `<rect x="890" y="296" width="18" height="78" rx="9" fill="#fff" opacity="0.5"/>`,
  ].join('\n  ')
}

/** a route, and what is happening on it — Maps */
function route(id) {
  const pin = (x, y, lit) =>
    `<path d="M${x} ${y} c -30 -34, -46 -54, -46 -80 a 46 46 0 1 1 92 0 c 0 26, -16 46, -46 80 z" fill="${lit ? ACCENT : '#fff'}" opacity="${lit ? 0.95 : 0.3}"/>` +
    `<circle cx="${x}" cy="${y - 84}" r="16" fill="#000" opacity="${lit ? 0.35 : 0.25}"/>`
  const out = []
  // the grid under it
  for (let i = 0; i < 6; i++) {
    out.push(
      `<line x1="${250 + i * 180}" y1="150" x2="${190 + i * 180}" y2="640" stroke="#fff" stroke-width="1.5" opacity="0.07"/>`,
      `<line x1="240" y1="${210 + i * 84}" x2="1160" y2="${210 + i * 84}" stroke="#fff" stroke-width="1.5" opacity="0.07"/>`,
    )
  }
  out.push(
    `<path d="M340 580 C 470 520, 460 380, 610 356 C 760 332, 800 470, 940 420 C 1020 392, 1040 318, 1060 268" fill="none" stroke="${ACCENT}" stroke-width="5" opacity="0.5" stroke-linecap="round" stroke-dasharray="1 0"/>`,
    `<path d="M340 580 C 470 520, 460 380, 610 356" fill="none" stroke="${ACCENT}" stroke-width="5" opacity="0.95" stroke-linecap="round"/>`,
    pin(610, 356, true),
    pin(1060, 268, false),
    `<circle cx="340" cy="580" r="14" fill="#fff" opacity="0.8"/>`,
    `<circle cx="340" cy="580" r="30" fill="none" stroke="#fff" stroke-width="2" opacity="0.28"/>`,
  )
  return out.join('\n  ')
}

/** a call, and the voice in it — Phone-call flow */
function wave(id) {
  const out = []
  const r = rng(71)
  for (let i = 0; i < 34; i++) {
    const x = 330 + i * 22
    const k = Math.sin(i * 0.42) * 0.5 + 0.5
    const h = 30 + k * 200 + r() * 40
    const lit = i > 9 && i < 24
    out.push(
      `<rect x="${x}" y="${(400 - h / 2).toFixed(0)}" width="8" height="${h.toFixed(0)}" rx="4" fill="${lit ? ACCENT : '#fff'}" opacity="${lit ? (0.55 + k * 0.4).toFixed(3) : 0.18}"/>`,
    )
  }
  out.push(
    `<circle cx="700" cy="400" r="286" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.08"/>`,
    `<circle cx="700" cy="400" r="352" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.05"/>`,
    `<rect x="560" y="556" width="280" height="64" rx="32" fill="${ACCENT}" opacity="0.16"/>`,
    `<path d="M652 588 a 84 84 0 0 1 96 0" fill="none" stroke="${ACCENT}" stroke-width="4" opacity="0.8" stroke-linecap="round"/>`,
  )
  return out.join('\n  ')
}

/** light and shadow doing the work — Neomorphism */
function soft(id) {
  // a raised panel is a dark shadow low-right, a light edge high-left, and a
  // fill a shade off the ground. At tile size the two edges have to be strong
  // or the whole thing disappears into the background.
  const raised = (x, y, w, h, r) => [
    `<rect x="${x + 14}" y="${y + 16}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity="0.3" filter="url(#soft-${id})"/>`,
    `<rect x="${x - 8}" y="${y - 9}" width="${w}" height="${h}" rx="${r}" fill="#fff" opacity="0.12" filter="url(#soft-${id})"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#2a2e35"/>`,
    `<path d="M${x + r} ${y + h} a ${r} ${r} 0 0 1 ${-r} ${-r} l 0 ${-(h - 2 * r)} a ${r} ${r} 0 0 1 ${r} ${-r} l ${w - 2 * r} 0" fill="none" stroke="#fff" stroke-width="2.5" opacity="0.2"/>`,
    `<path d="M${x + w - r} ${y} a ${r} ${r} 0 0 1 ${r} ${r} l 0 ${h - 2 * r} a ${r} ${r} 0 0 1 ${-r} ${r} l ${-(w - 2 * r)} 0" fill="none" stroke="#000" stroke-width="2.5" opacity="0.32"/>`,
  ]
  return [
    ...raised(420, 200, 560, 410, 70),
    // a dial pressed into it
    `<circle cx="588" cy="368" r="78" fill="#23272d"/>`,
    `<circle cx="588" cy="368" r="78" fill="none" stroke="#000" stroke-width="3" opacity="0.34"/>`,
    `<path d="M588 290 a 78 78 0 0 1 55 23" fill="none" stroke="#fff" stroke-width="3" opacity="0.22"/>`,
    `<circle cx="588" cy="368" r="30" fill="${ACCENT}" opacity="0.9"/>`,
    `<circle cx="588" cy="368" r="46" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.35"/>`,
    `<rect x="700" y="336" width="214" height="18" rx="9" fill="#fff" opacity="0.26"/>`,
    `<rect x="700" y="372" width="150" height="18" rx="9" fill="#fff" opacity="0.14"/>`,
    ...raised(500, 468, 400, 74, 37),
    `<rect x="528" y="494" width="196" height="20" rx="10" fill="${ACCENT}" opacity="0.6"/>`,
  ].join('\n  ')
}

/**
 * A signal going out — the contact banner.
 *
 * This one is not a grid tile: it fills a tall panel beside the form (about
 * 0.72:1), so it is cropped on the SIDES rather than top and bottom. Two
 * stations at the left and right edges were simply cut off. So it is built
 * around one centre instead, which survives a crop from any direction, and
 * nothing sits further than 300 from the middle.
 */
function signal(id) {
  const out = []
  // the outward rings
  for (let i = 0; i < 6; i++) {
    const r = 54 + i * 46
    out.push(
      `<circle cx="700" cy="410" r="${r}" fill="none" stroke="#fff" stroke-width="${(2.6 - i * 0.28).toFixed(2)}" opacity="${(0.42 - i * 0.055).toFixed(3)}"/>`,
    )
  }
  // three correspondents around it, close enough in to survive the crop
  const at = [
    [700, 158, 1],
    [486, 540, 0],
    [916, 520, 0],
  ]
  for (const [x, y, lit] of at) {
    out.push(
      `<line x1="700" y1="410" x2="${x}" y2="${y}" stroke="${lit ? ACCENT : '#fff'}" stroke-width="2" opacity="${lit ? 0.5 : 0.22}" stroke-dasharray="3 10"/>`,
      `<circle cx="${x}" cy="${y}" r="${lit ? 30 : 22}" fill="${lit ? ACCENT : '#fff'}" opacity="${lit ? 0.95 : 0.32}"/>`,
    )
  }
  // the packet on its way out
  out.push(
    `<circle cx="700" cy="292" r="11" fill="${ACCENT}"/>`,
    `<circle cx="700" cy="410" r="40" fill="#0b1418" opacity="0.72"/>`,
    `<circle cx="700" cy="410" r="27" fill="#fff" opacity="0.95"/>`,
    `<path d="M686 404 l 14 10 l 14 -10 m -28 0 l 0 14 l 28 0 l 0 -14 z" fill="none" stroke="#0b1418" stroke-width="2.4" stroke-linejoin="round"/>`,
  )
  return out.join('\n  ')
}

/** where it started — the internship row on the timeline */
function seed(id) {
  const out = [
    `<path d="M700 620 L 700 372" stroke="#fff" stroke-width="3" opacity="0.28"/>`,
    `<path d="M700 470 C 620 450, 566 396, 566 330 C 646 330, 700 392, 700 470 Z" fill="#fff" opacity="0.16"/>`,
    `<path d="M700 440 C 780 420, 834 366, 834 300 C 754 300, 700 362, 700 440 Z" fill="${ACCENT}" opacity="0.75"/>`,
    `<circle cx="700" cy="286" r="13" fill="${ACCENT}"/>`,
  ]
  for (let i = 0; i < 5; i++) {
    out.push(`<circle cx="${480 + i * 110}" cy="${600 - (i % 2) * 22}" r="4" fill="#fff" opacity="0.2"/>`)
  }
  return out.join('\n  ')
}

/* ── which cover is which ───────────────────────────────────────────────── */

const COVERS = [
  // id, top, bottom, glow, motif, zoom
  // zoom nudges one drawing against the shared SAFE scale — a sparse motif
  // (rings, a single nucleus) goes thin when shrunk, a dense one does not.
  ['support-desk', '#16323a', '#0a1417', '#3fb6a8', queue],
  ['atom', '#1b2a44', '#0a0f1a', '#5a7fd6', orbit, 1.3],
  ['smart-findings', '#152c33', '#090f12', '#42a89c', scatter, 1.1],
  ['skill-mate', '#25203f', '#0d0b17', '#8a6fd8', bubbles],
  ['car-dashboard', '#0f2430', '#070d12', '#3d93bf', gauge],
  ['tnpsc', '#2c2233', '#100c13', '#a06fb0', columns],
  ['pos-school', '#132b2a', '#080f0f', '#3fae91', bars],
  ['karupatti', '#3a2418', '#150c07', '#c08248', bands],
  ['seven-days', '#1d2a3c', '#0a0f16', '#5588c0', week],
  ['clickly', '#0f2c26', '#060f0d', '#3cb488', cursor, 1.18],
  ['art', '#33212c', '#120a0f', '#bd6f92', strokes],
  ['form-design', '#1a2733', '#080e13', '#4b86b8', fields],
  ['smartwatch', '#20242b', '#0a0c0f', '#7f8da0', watch],
  ['maps-event', '#123028', '#07100d', '#37a878', route],
  ['phone-flow', '#2a2036', '#0f0b14', '#8f72c4', wave, 1.12],
  ['neomorphism', '#23262c', '#0c0e11', '#8590a0', soft],
  ['contact', '#14262e', '#080f13', '#3a9fb0', signal, 1.15],
  ['intern', '#1d2b1f', '#0a100b', '#6aa85a', seed],
]

mkdirSync(OUT, { recursive: true })
let total = 0
for (const [id, top, bottom, glow, motif, zoom] of COVERS) {
  const svg = shell(id, top, bottom, glow, '  ' + motif(id), zoom)
  writeFileSync(join(OUT, `${id}.svg`), svg)
  total += Buffer.byteLength(svg)
  console.log(`  ${id}.svg`.padEnd(26), `${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`)
}
console.log(`\n${COVERS.length} covers, ${(total / 1024).toFixed(0)} KB total`)
