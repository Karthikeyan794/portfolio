import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Case-study diagrams. Each one is an inline SVG on a fixed viewBox so the
 * labels always line up with the boxes, and each draws itself in when it
 * scrolls into view: boxes rise, then the connectors draw.
 *
 * Colours come from the CSS tokens, so every diagram follows the theme.
 */

const box = { rest: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0, transition: { duration: 0.45 } } } as const
const line = {
  rest: { pathLength: 0, opacity: 0 },
  in: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
} as const
const group = { rest: {}, in: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }

const INK = 'var(--text)'
const DIM = 'var(--muted)'
const EDGE = 'var(--line-strong)'
const FILL = 'var(--bg-elev)'
const GOOD = 'var(--dia-good)'
const BAD = 'var(--dia-bad)'

/** the shell every diagram sits in */
function Board({ h, title, children }: { h: number; title: string; children: ReactNode }) {
  return (
    <motion.svg
      className="dia"
      viewBox={`0 0 760 ${h}`}
      role="img"
      aria-label={title}
      variants={group}
      initial="rest"
      whileInView="in"
      viewport={{ once: true, amount: 0.35 }}
    >
      <title>{title}</title>
      {children}
    </motion.svg>
  )
}

/** a labelled box — the building block of every flow here */
function Card({
  x, y, w = 150, h = 58, label, sub, dashed, tone,
}: { x: number; y: number; w?: number; h?: number; label: string; sub?: string; dashed?: boolean; tone?: 'good' | 'bad' }) {
  const stroke = tone === 'good' ? GOOD : tone === 'bad' ? BAD : EDGE
  return (
    <motion.g variants={box}>
      <rect x={x} y={y} width={w} height={h} rx={11} fill={FILL} stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? '5 4' : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" className="dia__label">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" className="dia__sub">
          {sub}
        </text>
      )}
    </motion.g>
  )
}

/** a connector; `d` is any path, so it handles elbows as well as straight runs */
function Link({ d, tone, dashed, bare }: { d: string; tone?: 'good' | 'bad'; dashed?: boolean; bare?: boolean }) {
  const stroke = tone === 'good' ? GOOD : tone === 'bad' ? BAD : EDGE
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={1.4}
      strokeDasharray={dashed ? '5 4' : undefined}
      markerEnd={bare ? undefined : tone === 'bad' ? 'url(#tip-bad)' : tone === 'good' ? 'url(#tip-good)' : 'url(#tip)'}
      variants={line}
    />
  )
}

function Tips() {
  return (
    <defs>
      {[['tip', EDGE], ['tip-good', GOOD], ['tip-bad', BAD]].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
        </marker>
      ))}
    </defs>
  )
}

/** the numbered pin — the callout style from my Behance case studies */
function Pin({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <motion.g variants={box}>
      <circle cx={x} cy={y} r={11} fill="var(--bg)" stroke={GOOD} strokeWidth={1.2} />
      <text x={x} y={y + 4} textAnchor="middle" className="dia__pin">
        {n}
      </text>
    </motion.g>
  )
}

function Note({ x, y, children, anchor = 'start' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' }) {
  return (
    <motion.text x={x} y={y} textAnchor={anchor} className="dia__note" variants={box}>
      {children}
    </motion.text>
  )
}

function Eyebrow({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <motion.text x={x} y={y} className="dia__eyebrow" variants={box}>
      {children}
    </motion.text>
  )
}

/* ── 1 ─ how a mail became a row, and stopped there ────────────────────── */
function SystemDiagram() {
  const gaps = ['No queue', 'No categories', 'No customer view', 'Mail still in Outlook']
  return (
    <Board h={296} title="A customer email became a SharePoint row, and stopped there">
      <Tips />
      <Eyebrow x={0} y={16} children="WHAT EXISTED BEFORE" />
      <Card x={0} y={34} w={158} label="Customer" sub="writes an email" />
      <Link d="M 164 63 H 196" />
      <Card x={202} y={34} w={158} label="Shared mailbox" sub="one Outlook inbox" />
      <Link d="M 366 63 H 398" />
      <Card x={404} y={34} w={150} label="Power Automate" sub="copies each mail" />
      <Link d="M 560 63 H 592" />
      <Card x={598} y={34} w={162} label="SharePoint list" sub="670 rows" />

      <Link d="M 679 98 V 132" dashed />
      <Eyebrow x={0} y={140} children="WHAT IT DID NOT GIVE ANYONE" />
      <motion.rect variants={box} x={0} y={152} width={760} height={128} rx={14} fill="none" stroke={EDGE} strokeDasharray="6 5" />
      {gaps.map((g, i) => (
        <Card key={g} x={16 + i * 184} y={172} w={168} h={52} label={g} dashed />
      ))}
      <Note x={16} y={258} children="The record existed. The system did not — so I wrote a brief that added nothing underneath it." />
    </Board>
  )
}

/* ── 2 ─ the column audit ──────────────────────────────────────────────── */
function AuditDiagram() {
  const rows: { label: string; n: number; note?: string }[] = [
    { label: 'Received date', n: 670 },
    { label: 'Description', n: 670 },
    { label: 'Mail link', n: 670 },
    { label: 'Assigned to', n: 2 },
    { label: 'Escalated — ever true', n: 0, note: 'written 670 times, true none' },
    { label: 'Sentiment · root cause · agent', n: 0, note: 'never written' },
    { label: 'Resolved / Closed time', n: 0, note: 'the column exists, and waits' },
  ]
  const x0 = 240
  const full = 440
  return (
    <Board h={300} title="How many of the 670 tickets actually had each column filled">
      <Eyebrow x={0} y={16} children="FILLED, OUT OF 670 TICKETS" />
      {rows.map((r, i) => {
        const y = 40 + i * 34
        const w = Math.max((r.n / 670) * full, r.n === 0 ? 0 : 7)
        return (
          <motion.g key={r.label} variants={box}>
            <text x={0} y={y + 13} className="dia__label dia__label--left">
              {r.label}
            </text>
            <rect x={x0} y={y} width={full} height={18} rx={9} fill="var(--bg-sunk)" />
            {r.n > 0 && (
              <motion.rect
                x={x0}
                y={y}
                height={18}
                rx={9}
                width={w}
                fill={r.n === 670 ? GOOD : BAD}
                variants={{ rest: { scaleX: 0 }, in: { scaleX: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
                style={{ originX: 0, transformBox: 'fill-box' }}
              />
            )}
            {r.note && (
              <text x={x0 + 14} y={y + 13} className="dia__note dia__note--left">
                {r.note}
              </text>
            )}
            <text x={760} y={y + 13} textAnchor="end" className="dia__code" style={{ fill: r.n === 670 ? GOOD : BAD }}>
              {r.n}
            </text>
          </motion.g>
        )
      })}
      <Note x={0} y={288} children="Six dashboard widgets could only ever read zero. That is a process problem, not a chart problem." />
    </Board>
  )
}

/* ── 3 ─ what my token could actually do ───────────────────────────────── */
function AccessDiagram() {
  const rows = [
    { op: 'Read list items', ok: true, code: '200' },
    { op: 'Write a field on an item', ok: true, code: '200' },
    { op: 'Create a list item', ok: true, code: '201' },
    { op: 'Add a column', ok: false, code: '403' },
    { op: 'Create a list', ok: false, code: '403' },
  ]
  return (
    <Board h={280} title="What a delegated, user-level token could and could not do">
      <Eyebrow x={0} y={16} children="MEASURED AGAINST THE LIVE SITE" />
      {rows.map((r, i) => {
        const y = 34 + i * 42
        return (
          <motion.g key={r.op} variants={box}>
            <rect x={0} y={y} width={760} height={34} rx={10} fill={FILL} stroke={r.ok ? EDGE : BAD} strokeWidth={1} strokeDasharray={r.ok ? undefined : '5 4'} />
            <text x={18} y={y + 22} className="dia__label dia__label--left">
              {r.op}
            </text>
            <text x={648} y={y + 22} className="dia__sub dia__sub--left" style={{ fill: r.ok ? GOOD : BAD }}>
              {r.ok ? 'allowed' : 'denied'}
            </text>
            <text x={726} y={y + 22} textAnchor="end" className="dia__code" style={{ fill: r.ok ? GOOD : BAD }}>
              {r.code}
            </text>
          </motion.g>
        )
      })}
      <Note x={0} y={266} children="No new columns and no new tables — so every feature had to fit the columns that already existed." />
    </Board>
  )
}

/* ── 4 ─ app role vs mailbox permission ────────────────────────────────── */
function PermissionsDiagram() {
  return (
    <Board h={300} title="The two-permission model: an app role is not a mailbox permission">
      <Tips />
      <Eyebrow x={0} y={16} children="THE APP CAN GRANT" />
      <motion.rect variants={box} x={0} y={28} width={352} height={186} rx={14} fill="none" stroke={GOOD} strokeDasharray="6 5" />
      <Card x={22} y={52} w={140} label="Admin" sub="approve, manage" tone="good" />
      <Card x={190} y={52} w={140} label="Support" sub="read + reply" tone="good" />
      <Card x={22} y={128} w={140} label="Viewer" sub="read only" tone="good" />
      <Note x={190} y={150} children="Granted inside the desk," />
      <Note x={190} y={166} children="in one click." />

      <Eyebrow x={408} y={16} children="ONLY EXCHANGE CAN GRANT" />
      <motion.rect variants={box} x={408} y={28} width={352} height={186} rx={14} fill="none" stroke={BAD} strokeDasharray="6 5" />
      <Card x={430} y={52} w={140} label="Full Access" sub="open the mailbox" tone="bad" />
      <Card x={598} y={52} w={140} label="Send As" sub="reply as the mailbox" tone="bad" />
      <Note x={430} y={150} children="An admin sets these in Exchange." />
      <Note x={430} y={166} children="They take up to an hour, and no API" />
      <Note x={430} y={182} children="can read whether someone has them." />

      <Link d="M 356 121 H 402" dashed tone="bad" />
      <motion.rect variants={box} x={0} y={236} width={760} height={46} rx={12} fill={FILL} stroke={EDGE} />
      <text x={20} y={264} className="dia__label dia__label--left">
        Pressing Approve grants the app role only — the dialog says so, because the mailbox is still IT&apos;s to give.
      </text>
    </Board>
  )
}

/* ── 5 ─ why a reply has to start as a draft ───────────────────────────── */
function ReplyDiagram() {
  return (
    <Board h={286} title="Draft then send keeps the thread; a plain send starts a new one">
      <Tips />
      <Card x={0} y={98} w={150} label="Someone types" sub="a reply" />

      <Eyebrow x={190} y={22} children="WHAT THE APP DOES" />
      <Link d="M 156 116 C 176 116 176 64 190 64" tone="good" />
      <Card x={196} y={36} w={166} label="createReply" sub="Graph returns a draft" tone="good" />
      <Link d="M 368 65 H 392" tone="good" />
      <Card x={398} y={36} w={166} label="Write on the draft" sub="quoted history kept" tone="good" />
      <Link d="M 570 65 H 594" tone="good" />
      <Card x={600} y={36} w={160} label="Send the draft" sub="same thread" tone="good" />
      <Pin x={611} y={116} n={1} />
      <Note x={628} y={120} children="One thread. One ticket." />

      <Eyebrow x={190} y={186} children="WHAT A PLAIN SEND WOULD DO" />
      <Link d="M 156 132 C 176 132 176 224 190 224" tone="bad" dashed />
      <Card x={196} y={196} w={166} label="sendMail" sub="a brand new message" tone="bad" dashed />
      <Link d="M 368 225 H 392" tone="bad" dashed />
      <Card x={398} y={196} w={166} label="New conversation id" sub="no threading headers" tone="bad" dashed />
      <Link d="M 570 225 H 594" tone="bad" dashed />
      <Card x={600} y={196} w={160} label="Duplicate ticket" sub="filed all over again" tone="bad" dashed />
      <Pin x={611} y={276} n={2} />
      <Note x={628} y={280} children="Same problem, twice." />
    </Board>
  )
}

/* ── 6 ─ the access gate ───────────────────────────────────────────────── */
function GateDiagram() {
  return (
    <Board h={330} title="What happens on load, and the three ways it can go">
      <Tips />
      <Eyebrow x={0} y={90} children="EVERY TIME THE APP LOADS" />
      <Card x={0} y={104} w={150} label="Sign in" sub="MSAL, no secret" />
      <Link d="M 156 133 H 180" />
      <Card x={186} y={104} w={176} label="Probe the inbox" sub="read help@ as me" />

      <Eyebrow x={400} y={18} children="IT WORKED" />
      <Link d="M 368 126 C 386 126 386 59 400 59" tone="good" />
      <Card x={400} y={30} w={196} label="The desk opens" sub="read and reply" tone="good" />

      <Eyebrow x={400} y={96} children="403 / 404 — A REAL NO" />
      <Link d="M 368 133 H 394" tone="bad" />
      <Card x={400} y={104} w={196} label="Full-screen gate" sub="read · read + reply" tone="bad" />
      <Link d="M 602 133 H 610" />
      <Card x={616} y={104} w={144} label="Request sent" sub="and it waits" />
      <Link d="M 498 162 V 176" />
      <Card x={400} y={180} w={360} h={54} label="App role from the admin  +  mailbox from IT" sub="the desk then opens on its own — no reload" />

      <Eyebrow x={400} y={250} children="ANY OTHER FAILURE" />
      <Link d="M 368 140 C 386 140 386 285 400 285" tone="good" dashed />
      <Card x={400} y={258} w={360} h={54} label="Timeout, throttle, 5xx — treated as access" sub="a blip must never lock out somebody who can work" tone="good" dashed />
    </Board>
  )
}

/* ── 7 ─ the customer directory, derived ───────────────────────────────── */
function DeriveDiagram() {
  return (
    <Board h={250} title="One email address becomes an account and a person">
      <Tips />
      <Eyebrow x={0} y={16} children="THE ONLY INPUT — AN ADDRESS ALREADY IN THE LIST" />
      <motion.g variants={box}>
        <rect x={0} y={30} width={344} height={52} rx={11} fill={FILL} stroke={EDGE} />
        <text x={24} y={62} className="dia__code dia__code--left" style={{ fill: INK }}>
          a.williams
        </text>
        <text x={116} y={62} className="dia__code dia__code--left" style={{ fill: DIM }}>
          @
        </text>
        <text x={132} y={62} className="dia__code dia__code--left" style={{ fill: INK }}>
          northwind-fm.com
        </text>
      </motion.g>
      <Pin x={24} y={100} n={1} />
      <Pin x={132} y={100} n={2} />

      <Link d="M 350 56 H 396" />
      <Card x={402} y={28} w={168} label="Person" sub="1 — the local part" tone="good" />
      <Card x={592} y={28} w={168} label="Account" sub="2 — the domain" tone="good" />

      <Eyebrow x={0} y={156} children="WHAT FALLS OUT OF IT, WITH NO DATA ENTRY" />
      <Card x={0} y={168} w={244} label="62 accounts" sub="grouped from the mail" />
      <Link d="M 250 197 H 278" />
      <Card x={284} y={168} w={192} label="The people in one" sub="every address seen" />
      <Link d="M 482 197 H 510" />
      <Card x={516} y={168} w={244} label="That person’s tickets" sub="what they keep raising" />
    </Board>
  )
}

/* ── 8 ─ the Teams bot ─────────────────────────────────────────────────── */
function TeamsDiagram() {
  const cmds = ['create', 'status', 'comment', 'close', 'reassign', 'notify']
  return (
    <Board h={300} title="How a message in Teams reaches the desk">
      <Tips />
      <Eyebrow x={0} y={16} children="TEAMS NEVER TALKS TO YOUR CODE DIRECTLY" />
      <Card x={0} y={34} w={172} label="@mention in Teams" sub="chat or channel" />
      <Link d="M 178 63 H 206" />
      <Card x={212} y={34} w={178} label="Azure Bot Service" sub="checks the app id" />
      <Link d="M 396 63 H 424" />
      <Card x={430} y={34} w={178} label="The bot endpoint" sub="/api/messages" />
      <Link d="M 614 63 H 642" />
      <Card x={648} y={34} w={112} label="The desk" sub="ticket API" tone="good" />

      <Link d="M 519 98 V 130" dashed />
      <Card x={430} y={130} w={178} label="Microsoft Graph" sub="real profile photos" />
      <Note x={624} y={152} children="No photo? An initials" />
      <Note x={624} y={168} children="badge, never a break." />

      <Eyebrow x={0} y={214} children="WHAT YOU CAN SAY TO IT" />
      {cmds.map((c, i) => (
        <motion.g key={c} variants={box}>
          <rect x={i * 128} y={228} width={116} height={38} rx={19} fill={FILL} stroke={EDGE} />
          <text x={i * 128 + 58} y={252} textAnchor="middle" className="dia__code">
            {c}
          </text>
        </motion.g>
      ))}
      <Note x={0} y={290} children="Running against a stubbed desk API today — six calls to swap, and a tenant admin to register it." />
    </Board>
  )
}

/* ── 9 ─ the three UI rules ────────────────────────────────────────────── */
function RulesDiagram() {
  return (
    <Board h={252} title="Three interface rules: inferred versus confirmed, avatar contrast, and popovers">
      <Tips />
      <Eyebrow x={0} y={16} children="INFERRED VS CONFIRMED" />
      <motion.g variants={box}>
        <rect x={0} y={34} width={128} height={34} rx={17} fill="none" stroke={EDGE} strokeDasharray="5 4" />
        <text x={64} y={56} textAnchor="middle" className="dia__label">
          Incident
        </text>
      </motion.g>
      <Note x={140} y={56} children="the app guessed" />
      <motion.g variants={box}>
        <rect x={0} y={84} width={128} height={34} rx={17} fill={GOOD} />
        <text x={64} y={106} textAnchor="middle" className="dia__label" style={{ fill: 'var(--bg)' }}>
          Incident
        </text>
      </motion.g>
      <Note x={140} y={106} children="a person confirmed" />
      <Note x={0} y={148} children="One shape carries the difference," />
      <Note x={0} y={164} children="so no field needs an “AUTO” badge." />

      <Eyebrow x={296} y={16} children="AVATAR CONTRAST" />
      <motion.g variants={box}>
        <circle cx={324} cy={62} r={26} fill="#9bb7c9" />
        <text x={324} y={68} textAnchor="middle" className="dia__label" style={{ fill: '#fff' }}>
          KB
        </text>
        <text x={362} y={58} className="dia__code" style={{ fill: BAD }}>
          2.4:1
        </text>
        <text x={362} y={74} className="dia__note dia__note--left">
          measured, not eyeballed
        </text>
      </motion.g>
      <motion.g variants={box}>
        <circle cx={324} cy={136} r={26} fill="#2f6d55" />
        <text x={324} y={142} textAnchor="middle" className="dia__label" style={{ fill: '#fff' }}>
          KB
        </text>
        <text x={362} y={132} className="dia__code" style={{ fill: GOOD }}>
          4.8:1
        </text>
        <text x={362} y={148} className="dia__note dia__note--left">
          one of eight fixed fills
        </text>
      </motion.g>

      <Eyebrow x={568} y={16} children="POPOVERS THE APP OWNS" />
      <motion.g variants={box}>
        <rect x={568} y={34} width={192} height={104} rx={12} fill={FILL} stroke={EDGE} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={584} y={52 + i * 26} width={120 - i * 18} height={10} rx={5} fill="var(--bg-sunk)" />
        ))}
      </motion.g>
      <Link d="M 664 152 V 146" />
      <Note x={568} y={172} children="It measures itself and flips" />
      <Note x={568} y={188} children="when it would overflow the panel." />

      <Note x={0} y={236} children="Small rules, decided once, so every screen in the desk behaves the same way." />
    </Board>
  )
}

/* ── 10 ─ what support actually had ────────────────────────────────────── */
function ProblemDiagram() {
  const asks = ['Who owns it?', 'What is its status?', 'Are we still in time?', 'Which customer is this?', 'Where is the history?']
  return (
    <Board h={252} title="One shared inbox, and the five questions it could not answer">
      <Tips />
      <Eyebrow x={0} y={16} children="WHAT SUPPORT ACTUALLY HAD" />
      <motion.g variants={box}>
        <rect x={0} y={34} width={212} height={152} rx={12} fill={FILL} stroke={EDGE} />
        <text x={20} y={58} className="dia__label dia__label--left">
          Shared Outlook inbox
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={20} y={74 + i * 26} width={172} height={18} rx={5} fill="var(--bg-sunk)" />
            <rect x={28} y={80 + i * 26} width={60 - i * 8} height={6} rx={3} fill={EDGE} />
          </g>
        ))}
      </motion.g>
      <Link d="M 218 110 H 248" />

      <motion.rect variants={box} x={256} y={34} width={504} height={152} rx={14} fill="none" stroke={BAD} strokeDasharray="6 5" />
      <Eyebrow x={274} y={58} children="FIVE QUESTIONS IT COULD NOT ANSWER" />
      {asks.map((a, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        return <Card key={a} x={274 + col * 158} y={72 + row * 52} w={150} h={40} label={a} dashed tone="bad" />
      })}
      <Note x={0} y={214} children="Every answer lived in somebody’s memory, or inside a thread nobody else could open." />
    </Board>
  )
}

/* ── 11 ─ what the team asked for ──────────────────────────────────────── */
function AsksDiagram() {
  const asks = [
    { n: 'R1', label: 'Assign it to a person', sub: 'and tell them in Teams' },
    { n: 'R2', label: 'A clock on the first reply', sub: 'the hours we promise' },
    { n: 'R3', label: 'Group by customer', sub: 'who raises the most' },
    { n: 'R4', label: 'A reply that starts written', sub: 'template + a suggestion' },
    { n: 'R5', label: 'Views per person', sub: 'saved, and shareable' },
    { n: 'R6', label: 'Access by role', sub: 'read · reply · manage' },
  ]
  return (
    <Board h={244} title="The six things the support team asked for in the first meeting">
      <Eyebrow x={0} y={16} children="FROM THE FIRST MEETING — THEY WERE ON A FRESHDESK BASIC PLAN AND WANTED OUT" />
      {asks.map((a, i) => {
        const x = (i % 3) * 260
        const y = 34 + Math.floor(i / 3) * 94
        return (
          <motion.g key={a.n} variants={box}>
            <rect x={x} y={y} width={240} height={78} rx={12} fill={FILL} stroke={EDGE} />
            <text x={x + 18} y={y + 26} className="dia__eyebrow">
              {a.n}
            </text>
            <text x={x + 18} y={y + 48} className="dia__label dia__label--left">
              {a.label}
            </text>
            <text x={x + 18} y={y + 65} className="dia__sub dia__sub--left">
              {a.sub}
            </text>
          </motion.g>
        )
      })}
      <Note x={0} y={232} children="Six asks. Everything I built after this is one of them." />
    </Board>
  )
}

/* ── 12 ─ the permissions, and why ─────────────────────────────────────── */
function ScopesDiagram() {
  const rows = [
    { s: 'Sites.ReadWrite.All', why: 'Read and write the ticket list — the app’s only database' },
    { s: 'Mail.ReadWrite.Shared', why: 'Open the real thread inside the shared mailbox' },
    { s: 'Mail.Send.Shared', why: 'Reply so the customer sees the desk, not one person' },
    { s: 'User.ReadBasic.All', why: 'The assignee list: names and photos' },
    { s: 'Chat.ReadWrite', why: 'Put the assignment card in front of the person in Teams' },
    { s: 'Presence.Read.All', why: 'Show who is free before you hand them a ticket' },
    { s: 'User.Read.All', why: 'Admin consent, asked separately — keeps the roster to enabled, licensed people', flag: true },
  ]
  return (
    <Board h={336} title="Every Microsoft permission the app asks for, and the reason for it">
      <Eyebrow x={0} y={16} children="COLLECTED BEFORE A LINE WAS WRITTEN — DELEGATED, SO THE APP IS ONLY EVER YOU" />
      {rows.map((r, i) => {
        const y = 34 + i * 40
        return (
          <motion.g key={r.s} variants={box}>
            <rect x={0} y={y} width={760} height={32} rx={9} fill={FILL} stroke={r.flag ? GOOD : EDGE} strokeDasharray={r.flag ? '5 4' : undefined} />
            <text x={16} y={y + 21} className="dia__code dia__code--left">
              {r.s}
            </text>
            <text x={264} y={y + 21} className="dia__note dia__note--left">
              {r.why}
            </text>
          </motion.g>
        )
      })}
      <Note x={0} y={326} children="Asked once, with a reason each, so nobody had to guess later what the app could reach." />
    </Board>
  )
}

/* ── 13 ─ the whole thing, end to end ──────────────────────────────────── */
function OverviewDiagram() {
  return (
    <Board h={330} title="The flow I drew before I drew a screen">
      <Tips />
      <Eyebrow x={0} y={16} children="INTAKE — LEFT EXACTLY AS IT WAS, BECAUSE THE BUSINESS ALREADY RUNS ON IT" />
      <Card x={0} y={34} w={140} label="Customer" sub="writes an email" />
      <Link d="M 146 63 H 172" />
      <Card x={178} y={34} w={158} label="Shared mailbox" sub="one address" />
      <Link d="M 342 63 H 368" />
      <Card x={374} y={34} w={158} label="Power Automate" sub="the intake flow" />
      <Link d="M 538 63 H 564" />
      <Card x={570} y={34} w={190} label="SharePoint list" sub="the only database" tone="good" />

      <Link d="M 665 98 V 118" />
      <Card x={570} y={124} w={190} label="The Support Desk" sub="static files" tone="good" />
      <Card x={340} y={124} w={200} label="The AI assistant" sub="writes its reading back" dashed />
      <Link d="M 440 124 V 106 H 640 V 100" dashed />

      <Eyebrow x={0} y={140} children="WHAT THE DESK DOES WITH IT" />
      <Note x={0} y={166} children="It is static files carrying your" />
      <Note x={0} y={182} children="own token — no server of its" />
      <Note x={0} y={198} children="own holds anybody’s data." />

      <Link d="M 665 182 V 204 H 116" bare tone="good" />
      <Link d="M 116 204 V 224" tone="good" />
      <Link d="M 380 204 V 224" tone="good" />
      <Link d="M 644 204 V 224" tone="good" />
      <Card x={0} y={230} w={232} h={58} label="Reply from the mailbox" sub="same thread, no duplicate" tone="good" />
      <Card x={264} y={230} w={232} h={58} label="Assignment card in Teams" sub="ticket, customer, a link back" tone="good" />
      <Card x={528} y={230} w={232} h={58} label="Dashboards and SLA clocks" sub="computed in the browser" tone="good" />
      <Note x={0} y={318} children="Nothing underneath changed: the mailbox, the intake flow and the list are exactly where they were." />
    </Board>
  )
}

/* ── 14 ─ the options, weighed ─────────────────────────────────────────── */
function CompareDiagram() {
  const opts = [
    { label: 'Stay in Outlook', good: 'Free, already there, nothing to learn', bad: 'No owner, no status, no clock, no customer view' },
    { label: 'The Freshdesk plan we had', good: 'A real helpdesk, and the team knew it', bad: 'A licence per agent, one more login, mail still in Outlook' },
    { label: 'Another hosted desk', good: 'Every feature on the list, out of the box', bad: 'Same licence per agent — and the tickets leave the tenant' },
    { label: 'Build it on the tenant we pay for', good: 'No new licence, data stays in SharePoint, Teams is native', bad: 'Every feature is mine to build and to keep working', pick: true },
  ]
  return (
    <Board h={290} title="The four options, and why the desk was built rather than bought">
      <Eyebrow x={0} y={16} children="WEIGHED AGAINST THE SIX ASKS" />
      {opts.map((o, i) => {
        const x = (i % 2) * 388
        const y = 34 + Math.floor(i / 2) * 120
        return (
          <motion.g key={o.label} variants={box}>
            <rect x={x} y={y} width={372} height={104} rx={12} fill={FILL} stroke={o.pick ? GOOD : EDGE} strokeWidth={o.pick ? 1.4 : 1} />
            <text x={x + 18} y={y + 28} className="dia__label dia__label--left">
              {o.label}
            </text>
            <text x={x + 18} y={y + 54} className="dia__note dia__note--left" style={{ fill: GOOD }}>
              {'+  ' + o.good}
            </text>
            <text x={x + 18} y={y + 78} className="dia__note dia__note--left" style={{ fill: BAD }}>
              {'—  ' + o.bad}
            </text>
          </motion.g>
        )
      })}
      <Pin x={748} y={166} n={1} />
      <Note x={0} y={282} children="1 — chosen: the six asks were all reachable with permissions we already owned, and nobody had to buy a seat." />
    </Board>
  )
}

/* ── 15 ─ assign, and the person hears about it ────────────────────────── */
function AssignDiagram() {
  return (
    <Board h={288} title="Assigning a ticket, and how the person finds out">
      <Tips />
      <Eyebrow x={0} y={16} children="FOUR STEPS, AND THE PERSON NEVER OPENS THE APP TO LEARN ABOUT IT" />
      <Card x={0} y={34} w={176} label="Pick a person" sub="roster from Graph" />
      <Link d="M 182 63 H 206" />
      <Card x={212} y={34} w={176} label="The row is written" sub="assignee + status" />
      <Link d="M 394 63 H 418" />
      <Card x={424} y={34} w={158} label="Power Automate" sub="watches the list" />
      <Link d="M 588 63 H 612" />
      <Card x={618} y={34} w={142} label="Teams" sub="an Adaptive Card" tone="good" />

      <Note x={0} y={118} children="The roster only shows enabled," />
      <Note x={0} y={134} children="licensed members, and a dot says" />
      <Note x={0} y={150} children="who is free before you hand it over." />

      <motion.g variants={box}>
        <rect x={212} y={108} width={342} height={140} rx={12} fill={FILL} stroke={GOOD} />
        <circle cx={240} cy={136} r={13} fill="#2f6d55" />
        <text x={240} y={141} textAnchor="middle" className="dia__pin" style={{ fill: '#fff' }}>
          KB
        </text>
        <text x={264} y={132} className="dia__label dia__label--left">
          #627 assigned to you
        </text>
        <text x={264} y={148} className="dia__sub dia__sub--left">
          Redgate Retail · dashboard widget
        </text>
        <rect x={232} y={166} width={302} height={1} fill={EDGE} />
        <text x={232} y={192} className="dia__note dia__note--left">
          Ticket number, customer, subject and status —
        </text>
        <text x={232} y={208} className="dia__note dia__note--left">
          enough to know if it is yours before you click.
        </text>
        <rect x={232} y={220} width={110} height={26} rx={13} fill={GOOD} />
        <text x={287} y={237} textAnchor="middle" className="dia__sub" style={{ fill: 'var(--bg)' }}>
          OPEN TICKET
        </text>
      </motion.g>
      <Note x={578} y={140} children="The photo on the card is" />
      <Note x={578} y={156} children="the real Teams one, pulled" />
      <Note x={578} y={172} children="from Graph and embedded —" />
      <Note x={578} y={188} children="initials when there is none." />
      <Note x={0} y={276} children="The card is built in the app and posted verbatim by the flow, so Teams needs nothing from the browser." />
    </Board>
  )
}

/* ── 16 ─ a reply that starts written ──────────────────────────────────── */
function AiReplyDiagram() {
  return (
    <Board h={320} title="Where the words in a reply come from, and how it reaches the customer">
      <Tips />
      <Eyebrow x={0} y={16} children="THREE SOURCES, ONE COMPOSER" />
      <Card x={0} y={34} w={236} label="The template" sub="greeting, signature, thread" />
      <Card x={0} y={106} w={236} label="The AI suggestion" sub="read from the ticket’s columns" dashed />
      <Card x={0} y={178} w={236} label="What the person types" sub="always the last word" tone="good" />
      <Link d="M 242 63 C 268 63 268 140 288 140" />
      <Link d="M 242 135 H 288" dashed />
      <Link d="M 242 207 C 268 207 268 150 288 150" tone="good" />

      <Card x={294} y={112} w={168} h={58} label="The composer" sub="draft kept in SharePoint" />
      <Link d="M 468 141 H 492" tone="good" />
      <Card x={498} y={112} w={126} h={58} label="createReply" sub="Graph draft" tone="good" />
      <Link d="M 630 141 H 654" tone="good" />
      <Card x={660} y={112} w={100} h={58} label="Sent" sub="same thread" tone="good" />

      <Eyebrow x={294} y={214} children="THE THREE STATES A READING CAN BE IN" />
      {[
        { k: 'answered', t: 'good' as const },
        { k: 'needs input', t: undefined },
        { k: 'no reading yet', t: 'bad' as const },
      ].map((st, i) => (
        <Card key={st.k} x={294 + i * 158} y={226} w={148} h={40} label={st.k} tone={st.t} dashed={st.t !== 'good'} />
      ))}
      <Note x={0} y={252} children="A draft is private — item" />
      <Note x={0} y={268} children="permissions plus an author" />
      <Note x={0} y={284} children="filter, because half-written" />
      <Note x={0} y={300} children="words are the app’s most" />
      <Note x={0} y={316} children="private thing." />
      <Note x={294} y={294} children="No reading yet is the common case, not an error — so it never looks like one." />
    </Board>
  )
}

/* ── 17 ─ saved views ──────────────────────────────────────────────────── */
function ViewsDiagram() {
  const chips = ['Status', 'Customer', 'Assignee', 'Type', 'Module', 'Date']
  return (
    <Board h={262} title="Filters become a named view, kept to yourself or shared with the desk">
      <Tips />
      <Eyebrow x={0} y={16} children="THIRTEEN FILTERS, SET ONCE" />
      {chips.map((c, i) => (
        <motion.g key={c} variants={box}>
          <rect x={i * 84} y={30} width={74} height={30} rx={15} fill={FILL} stroke={EDGE} />
          <text x={i * 84 + 37} y={50} textAnchor="middle" className="dia__sub">
            {c}
          </text>
        </motion.g>
      ))}
      <Link d="M 250 68 V 92" />
      <Card x={168} y={92} w={200} h={54} label="Save it with a name" sub="and decide who sees it" tone="good" />

      <Link d="M 268 152 C 268 172 120 170 120 190" />
      <Card x={0} y={190} w={240} h={54} label="Mine" sub="only I see these" />
      <Link d="M 300 152 C 300 172 440 170 440 190" />
      <Card x={320} y={190} w={240} h={54} label="Shared by the desk" sub="the team’s own queues" tone="good" />
      <Note x={584} y={212} children="Only the owner can rename," />
      <Note x={584} y={228} children="reshare or remove one —" />
      <Note x={584} y={244} children="a shared view is their work." />
      <Note x={0} y={262} children="The list splits in two, because “who else can see this” is the question people actually have." />
    </Board>
  )
}

/* ── 18 ─ the two clocks ───────────────────────────────────────────────── */
function SlaDiagram() {
  return (
    <Board h={280} title="Two SLA clocks: one to the first reply, one to closing the ticket">
      <Tips />
      <Eyebrow x={0} y={16} children="BOTH CLOCKS START WHEN THE MAIL ARRIVED, AND NEITHER RESTARTS" />
      <motion.g variants={box}>
        <rect x={0} y={44} width={760} height={2} rx={1} fill={EDGE} />
        {[
          { x: 0, label: 'Mail received', a: 'start' as const },
          { x: 300, label: 'First reply', a: 'middle' as const },
          { x: 700, label: 'Closed', a: 'end' as const },
        ].map((m) => (
          <g key={m.label}>
            <circle cx={m.x + 6} cy={45} r={6} fill={FILL} stroke={EDGE} strokeWidth={1.4} />
            <text x={m.a === 'start' ? 0 : m.a === 'end' ? 760 : m.x + 6} y={30} textAnchor={m.a} className="dia__sub">
              {m.label}
            </text>
          </g>
        ))}
      </motion.g>

      <motion.g variants={box}>
        <rect x={6} y={70} width={300} height={30} rx={15} fill="none" stroke={GOOD} />
        <text x={156} y={90} textAnchor="middle" className="dia__label" style={{ fill: GOOD }}>
          Response · target 3 hours
        </text>
      </motion.g>
      <motion.g variants={box}>
        <rect x={6} y={112} width={700} height={30} rx={15} fill="none" stroke={EDGE} strokeDasharray="5 4" />
        <text x={356} y={132} textAnchor="middle" className="dia__label">
          Resolution · deliberately left blank
        </text>
      </motion.g>

      <Eyebrow x={0} y={178} children="WHY THREE HOURS, AND WHY THE SECOND ONE IS EMPTY" />
      <Card x={0} y={190} w={244} h={58} label="39 of 61 met" sub="a 3-hour first reply — 64%" tone="good" />
      <Card x={258} y={190} w={244} h={58} label="0 of 58 met" sub="a 3-hour close — never once" tone="bad" dashed />
      <Card x={516} y={190} w={244} h={58} label="504 hours" sub="the median time to close" />
      <Note x={0} y={272} children="One of those is a target, the other is a wish — so the second column is left for somebody to set honestly." />
    </Board>
  )
}

/* ── 19 ─ did every mail become a ticket? ──────────────────────────────── */
function IntakeDiagram() {
  return (
    <Board h={262} title="The intake check: conversations in the mailbox against tickets created">
      <Tips />
      <Eyebrow x={0} y={16} children="COUNTED PER ADDRESS, BECAUSE ONE BROKEN ALIAS DISAPPEARS INSIDE A HEALTHY TOTAL" />
      <motion.g variants={box}>
        <text x={300} y={48} textAnchor="middle" className="dia__eyebrow">
          CONVERSATIONS
        </text>
        <text x={470} y={48} textAnchor="middle" className="dia__eyebrow">
          TICKETS
        </text>
      </motion.g>
      {[
        { a: 'The main support address', ok: true },
        { a: 'A customer-specific alias', ok: false },
        { a: 'Another alias', ok: false },
      ].map((r, i) => {
        const y = 60 + i * 48
        return (
          <motion.g key={r.a} variants={box}>
            <rect x={0} y={y} width={760} height={38} rx={10} fill={FILL} stroke={r.ok ? EDGE : BAD} strokeDasharray={r.ok ? undefined : '5 4'} />
            <text x={18} y={y + 24} className="dia__label dia__label--left">
              {r.a}
            </text>
            <rect x={262} y={y + 13} width={76} height={12} rx={6} fill={EDGE} />
            <rect x={432} y={y + 13} width={r.ok ? 76 : 0} height={12} rx={6} fill={r.ok ? GOOD : 'none'} />
            {!r.ok && <rect x={432} y={y + 13} width={76} height={12} rx={6} fill="none" stroke={BAD} strokeDasharray="4 3" />}
            <text x={742} y={y + 24} textAnchor="end" className="dia__code" style={{ fill: r.ok ? GOOD : BAD }}>
              {r.ok ? 'match' : 'nothing arrived'}
            </text>
          </motion.g>
        )
      })}
      <Note x={0} y={228} children="Mail to the customer aliases had been ignored by the intake flow for months, and left no trace —" />
      <Note x={0} y={248} children="the only evidence of a missed mail is a ticket that was never created. Found by sweeping 21,000 messages." />
    </Board>
  )
}

const DIAGRAMS: Record<string, () => ReactNode> = {
  system: SystemDiagram,
  audit: AuditDiagram,
  access: AccessDiagram,
  permissions: PermissionsDiagram,
  reply: ReplyDiagram,
  gate: GateDiagram,
  derive: DeriveDiagram,
  teams: TeamsDiagram,
  rules: RulesDiagram,
  problem: ProblemDiagram,
  asks: AsksDiagram,
  scopes: ScopesDiagram,
  overview: OverviewDiagram,
  compare: CompareDiagram,
  assign: AssignDiagram,
  aireply: AiReplyDiagram,
  views: ViewsDiagram,
  sla: SlaDiagram,
  intake: IntakeDiagram,
}

export default function Diagram({ id }: { id: string }) {
  const D = DIAGRAMS[id]
  if (!D) return null
  return <D />
}
