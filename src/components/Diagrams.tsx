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
function Link({ d, tone, dashed }: { d: string; tone?: 'good' | 'bad'; dashed?: boolean }) {
  const stroke = tone === 'good' ? GOOD : tone === 'bad' ? BAD : EDGE
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={1.4}
      strokeDasharray={dashed ? '5 4' : undefined}
      markerEnd={tone === 'bad' ? 'url(#tip-bad)' : tone === 'good' ? 'url(#tip-good)' : 'url(#tip)'}
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
}

export default function Diagram({ id }: { id: string }) {
  const D = DIAGRAMS[id]
  if (!D) return null
  return <D />
}
