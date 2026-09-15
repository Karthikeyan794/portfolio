import { motion } from 'motion/react'

/**
 * Where you can go in the desk, as a branching map — the primary path a
 * support person walks every day is picked out, everything else is a branch
 * off it. Nodes rise in, then the connectors draw.
 */

const W = 1160
const H = 520

type Node = { id: string; x: number; y: number; w: number; label: string; hot?: boolean; start?: boolean }

const NODES: Node[] = [
  { id: 'in', x: 20, y: 258, w: 150, label: 'Sign in', start: true },
  { id: 'gate', x: 200, y: 258, w: 160, label: 'Access gate', hot: true },
  { id: 'desk', x: 390, y: 258, w: 150, label: 'The desk', hot: true },

  { id: 'queue', x: 570, y: 60, w: 170, label: 'Ticket queue', hot: true },
  { id: 'cust', x: 570, y: 236, w: 170, label: 'Customers', },
  { id: 'dash', x: 570, y: 336, w: 170, label: 'Dashboard' },
  { id: 'acl', x: 570, y: 436, w: 170, label: 'Access & roles' },

  { id: 'ticket', x: 770, y: 60, w: 170, label: 'A ticket', hot: true },
  { id: 'views', x: 770, y: 140, w: 170, label: 'Saved views' },
  { id: 'acct', x: 770, y: 236, w: 170, label: 'An account' },
  { id: 'kpi', x: 770, y: 336, w: 170, label: 'Volume & SLA' },
  { id: 'req', x: 770, y: 436, w: 170, label: 'Requests' },

  { id: 'thread', x: 970, y: 20, w: 170, label: 'Email thread', hot: true },
  { id: 'detail', x: 970, y: 84, w: 170, label: 'Details & type' },
  { id: 'assign', x: 970, y: 148, w: 170, label: 'Assign → Teams' },
  { id: 'people', x: 970, y: 236, w: 170, label: 'People & tickets' },
  { id: 'appr', x: 970, y: 436, w: 170, label: 'Approve a role' },
]

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))
const NH = 40

/** an elbow from the right edge of `a` into the left edge of `b` */
function elbow(a: Node, b: Node) {
  const x1 = a.x + a.w
  const y1 = a.y + NH / 2
  const x2 = b.x
  const y2 = b.y + NH / 2
  const mid = x1 + Math.max(18, (x2 - x1) / 2)
  if (Math.abs(y1 - y2) < 1) return `M ${x1} ${y1} H ${x2}`
  const dir = y2 > y1 ? 1 : -1
  const r = 12
  return `M ${x1} ${y1} H ${mid - r} Q ${mid} ${y1} ${mid} ${y1 + r * dir} V ${y2 - r * dir} Q ${mid} ${y2} ${mid + r} ${y2} H ${x2}`
}

const EDGES: [string, string, boolean?][] = [
  ['in', 'gate', true],
  ['gate', 'desk', true],
  ['desk', 'queue', true],
  ['desk', 'cust'],
  ['desk', 'dash'],
  ['desk', 'acl'],
  ['queue', 'ticket', true],
  ['queue', 'views'],
  ['ticket', 'thread', true],
  ['ticket', 'detail'],
  ['ticket', 'assign'],
  ['cust', 'acct'],
  ['acct', 'people'],
  ['dash', 'kpi'],
  ['acl', 'req'],
  ['req', 'appr'],
]

const group = { rest: {}, in: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }
const pop = {
  rest: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const
const draw = {
  rest: { pathLength: 0, opacity: 0 },
  in: { pathLength: 1, opacity: 1, transition: { duration: 0.55, ease: 'easeInOut' } },
} as const

export default function UserFlow() {
  return (
    <section className="uflow" id="how" aria-label="User flow through the desk">
      <div className="uflow__head">
        <h2 className="uflow__title">User flow</h2>
        <p className="uflow__note">
          Every route through the desk, with the one a support person walks all day picked out. Everything else hangs off
          it — which is the point: the daily path should be the shortest one on the map.
        </p>
      </div>

      <motion.svg
        className="uflow__map"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="A branching map of the desk: sign in, the access gate, the desk, then the queue, customers, dashboard and access"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.25 }}
      >
        {EDGES.map(([a, b, hot]) => (
          <motion.path
            key={a + b}
            d={elbow(byId[a], byId[b])}
            fill="none"
            stroke={hot ? 'var(--accent)' : 'var(--line-strong)'}
            strokeWidth={hot ? 1.6 : 1.2}
            variants={draw}
          />
        ))}
        {EDGES.map(([a, b]) => {
          const n = byId[b]
          return <motion.circle key={'d' + a + b} cx={n.x - 5} cy={n.y + NH / 2} r={2.6} fill="var(--line-strong)" variants={pop} />
        })}

        {NODES.map((n) => (
          <motion.g key={n.id} variants={pop}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={NH}
              rx={NH / 2}
              fill={n.start ? 'var(--accent)' : 'var(--bg-elev)'}
              stroke={n.start ? 'var(--accent)' : n.hot ? 'var(--accent)' : 'var(--line-strong)'}
              strokeWidth={1}
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + NH / 2 + 4.5}
              textAnchor="middle"
              className="uflow__label"
              style={{ fill: n.start ? 'var(--accent-ink)' : n.hot ? 'var(--text)' : 'var(--text-mid)' }}
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </motion.svg>

      <div className="uflow__key">
        <span className="uflow__key-hot">The daily path</span>
        <span className="uflow__key-cold">Everything else</span>
      </div>
    </section>
  )
}
