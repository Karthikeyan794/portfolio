// ─────────────────────────────────────────────────────────────
// Everything you'd want to edit lives in this file.
// Swap the copy, projects and links — the UI adapts.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Karthikeyan B',
  role: 'Frontend Engineer',
  location: 'Chennai, India',
  available: true,
  availableNote: 'Open to interesting frontend work',
  tagline:
    'I build product interfaces that stay fast and legible as they grow — design systems, dense data UI, and the internal tools teams actually use every day.',
  email: 'karthikeyan.b@facilio.com',
  resumeUrl: '', // e.g. '/resume.pdf' — drop the file in /public
  photo: '', // e.g. '/me.jpg' — drop the file in /public. Empty = initials placeholder.
}

export const socials: { label: string; href: string }[] = [
  { label: 'Behance', href: 'https://www.behance.net/karthikbabu13' },
  { label: 'GitHub', href: 'https://github.com/Karthikeyan794' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'X', href: 'https://x.com/' },
]

export const about = [
  'I work on the web side of building software: turning fuzzy product requirements into interfaces that hold up under real data, real users and years of iteration.',
  'Most of my time goes into three things — component libraries that stay consistent without slowing anyone down, data-heavy screens that stay responsive at scale, and the unglamorous internal tooling that quietly saves a team hours a week.',
]

export type Slice = {
  /** 'full' = wide row · 'half' = two per row */
  span?: 'full' | 'half'
  heading?: string
  body?: string
  image?: string
  caption?: string
  /** an embedded video: an mp4 in /public or a YouTube/Loom embed URL */
  video?: string
}

export type Project = {
  slug: string
  title: string
  /** one line under the title in the grid */
  tagline: string
  blurb: string
  year: string
  role?: string
  tags: string[]
  emoji: string // fallback when there is no cover image
  cover?: string
  /** the Behance gallery for this project — shown as a link inside its page */
  behance?: string
  /** a live demo people can try */
  demo?: { label: string; href: string }
  /** how big the tile is in the bento grid */
  size?: 'hero' | 'wide' | 'tall' | 'small'
  /** the tile's tint — kept pale so the primary green stays special */
  tone?: 'cream' | 'sage' | 'mist' | 'blush' | 'sand' | 'lime'
  /** 'work' = real/client · 'practice' = course or self-set exercise */
  kind?: 'work' | 'practice'
  /** which bento block this belongs to */
  group: 'product' | 'craft'
  /** when present the tile opens a case-study page instead of an external link */
  detail?: {
    intro: string
    facts: { label: string; value: string }[]
    slices: Slice[]
  }
}

/**
 * Main project work first (case studies with demos), then the design work
 * from behance.net/karthikbabu13. Blurbs are first drafts — rewrite freely.
 *
 * Covers all come from /bento/ so the grid reads as one set; swap any of them
 * for your own generated art later (same path, same filename).
 */
export const projects: Project[] = [
  {
    slug: 'support-desk',
    group: 'product',
    title: 'Support Desk',
    tagline: 'The helpdesk our support team lives in',
    blurb:
      'A support console built around the ticket queue — triage, assignment, SLA pressure and reply history in one screen, so an agent never loses the thread of a conversation.',
    year: '2025',
    role: 'Design + Frontend',
    tags: ['Product', 'React', 'Design system'],
    emoji: '🎧',
    cover: '/bento/support-desk.jpg',
    size: 'hero',
    tone: 'sage',
    kind: 'work',
    demo: { label: 'Try the demo', href: '' }, // ← paste the demo URL when it is ready
    detail: {
      intro:
        'Support Desk is the tool our support team uses every day. The brief was simple to say and hard to build: let an agent see everything about a ticket without leaving the screen they are on.',
      facts: [
        { label: 'Role', value: 'Design + Frontend' },
        { label: 'Year', value: '2025' },
        { label: 'Stack', value: 'React · TypeScript' },
        { label: 'Status', value: 'In production' },
      ],
      slices: [
        {
          span: 'full',
          heading: 'The problem',
          body: 'Agents were juggling several tabs to answer one ticket — the conversation in one, the customer record in another, the SLA clock somewhere else. Context got lost and replies got slower.',
          image: '/bento/support-flow.jpg',
          caption: 'Mapping the support workflow before touching any UI.',
        },
        {
          span: 'half',
          heading: 'Triage first',
          body: 'The queue leads with what forces a decision: age, priority and who owns it. Everything else waits until it is asked for.',
        },
        {
          span: 'half',
          heading: 'One screen, whole story',
          body: 'Conversation, customer history and internal notes sit side by side, so the reply box is never more than a glance away from the context it needs.',
        },
        { span: 'full', heading: 'Walkthrough', body: 'A short run through the flow end to end.', video: '' },
      ],
    },
  },
  {
    slug: 'atom',
    group: 'product',
    title: 'Atom',
    tagline: 'Small AI apps, built and shipped fast',
    blurb:
      'A platform for small AI-powered apps — request one, watch it get built, then run it. I designed the catalogue, the request and approval flow, and the credit accounting behind it.',
    year: '2025',
    role: 'Design + Frontend',
    tags: ['AI', 'Platform', 'Dashboard'],
    emoji: '⚛️',
    cover: '/bento/atom.jpg',
    size: 'wide',
    tone: 'mist',
    kind: 'work',
    demo: { label: 'Try the demo', href: '' },
    detail: {
      intro:
        'Atom turns "I wish we had a tool for this" into a working app. My part was the surface people actually touch: browsing what exists, asking for something new, and understanding what it costs.',
      facts: [
        { label: 'Role', value: 'Design + Frontend' },
        { label: 'Year', value: '2025' },
        { label: 'Stack', value: 'React · TypeScript' },
        { label: 'Status', value: 'In production' },
      ],
      slices: [
        {
          span: 'full',
          heading: 'A catalogue you can scan',
          body: 'Dozens of small apps, each with its own purpose. The cards lead with what the app does for you, not what it is called internally.',
          image: '/bento/smart-findings.jpg',
        },
        { span: 'half', heading: 'Ask, approve, build', body: 'A request flow that stays honest about where your app is: asked for, approved, being built, ready.' },
        { span: 'half', heading: 'Credits that make sense', body: 'Usage shown per team and per app, so the bill is never a surprise at the end of the month.' },
        { span: 'full', heading: 'Walkthrough', body: '', video: '' },
      ],
    },
  },
  {
    slug: 'skill-mate',
    group: 'product',
    title: 'Skill Mate',
    tagline: 'AI-powered mock interviews',
    blurb:
      'Practice sessions, question flow and feedback screens designed so a nervous candidate always knows what happens next.',
    year: '2025',
    tags: ['Product design', 'AI', 'UI/UX'],
    emoji: '🎤',
    cover: '/bento/fm-assistant.jpg',
    behance: 'https://www.behance.net/gallery/230495131/Skill-Mate-AI-Powered-mock-interview',
    size: 'tall',
    tone: 'blush',
  },
  {
    slug: 'car-dashboard',
    group: 'product',
    title: 'Car Dashboard',
    tagline: 'Dark & light, built for a glance',
    blurb: 'An in-car dashboard in both modes — speed, media, navigation and climate kept glanceable at driving speed.',
    year: '2025',
    tags: ['Dashboard', 'Dark mode', 'UI'],
    emoji: '🚗',
    cover: '/bento/dispatcher.jpg',
    behance: 'https://www.behance.net/gallery/230978875/Car-Dashboard-Dark-Light-mode',
    size: 'wide',
    tone: 'cream',
  },
  {
    slug: 'tnpsc',
    group: 'product',
    title: 'TNPSC Redesign',
    tagline: 'A government exam portal, made usable',
    blurb: 'A case study: the information aspirants actually need, found in fewer taps and readable on a cheap phone.',
    year: '2024',
    tags: ['Case study', 'Web', 'Accessibility'],
    emoji: '🏛️',
    cover: '/bento/city.jpg',
    behance: 'https://www.behance.net/gallery/214619697/TNPSC-website-Redesign-case-study',
    size: 'small',
    tone: 'sand',
  },
  {
    slug: 'pos-school',
    group: 'product',
    title: 'POS School Dashboard',
    tagline: 'Fees, attendance, records',
    blurb: 'A school management and point-of-sale dashboard for staff who are always in a hurry.',
    year: '2024',
    tags: ['Dashboard', 'POS'],
    emoji: '🏫',
    cover: '/bento/documents.jpg',
    behance: 'https://www.behance.net/gallery/214624079/POS-school-management-Dashboard',
    size: 'small',
    tone: 'sage',
  },
  {
    slug: 'coffee-dashboard',
    group: 'product',
    title: 'Nellai Karupatti Coffee',
    tagline: 'Orders, stock and sales in one screen',
    blurb: 'An admin dashboard for a coffee brand, with the numbers that matter first.',
    year: '2025',
    tags: ['Dashboard', 'Data UI'],
    emoji: '☕',
    cover: '/bento/lobby.jpg',
    behance: 'https://www.behance.net/gallery/217302653/Nellai-Karupatti-Coffee-Dashboard',
    size: 'small',
    tone: 'sand',
  },
  {
    slug: 'redesign-challenge',
    group: 'craft',
    title: '7 Days Redesign',
    tagline: 'Seven days, seven redesigns',
    blurb: 'A self-set sprint to practise moving fast from critique to a cleaner screen.',
    year: '2025',
    tags: ['Redesign', 'Challenge'],
    emoji: '📅',
    cover: '/bento/skyline.jpg',
    behance: 'https://www.behance.net/gallery/230895267/7-Days_Redesign-Challenge',
    size: 'small',
    tone: 'mist',
    kind: 'practice',
  },
  {
    slug: 'logofolio',
    group: 'craft',
    title: 'Logofolio',
    tagline: 'Marks, including Clickly',
    blurb: 'Logo and identity work — construction, spacing and how each mark holds up small.',
    year: '2024',
    tags: ['Branding', 'Logo'],
    emoji: '✦',
    cover: '/bento/welcome.jpg',
    behance: 'https://www.behance.net/gallery/215584601/Logofolio-%28Clickly%29',
    size: 'small',
    tone: 'cream',
  },
  {
    slug: 'drawings',
    group: 'craft',
    title: 'Drawings & Art',
    tagline: 'Sketchbook, studies and illustration',
    blurb:
      'Work made by hand and for its own sake — sketches, studies and finished illustration. The place the design instinct actually comes from.',
    year: '2024 — 2026',
    tags: ['Illustration', 'Sketchbook', 'Art'],
    emoji: '🎨',
    cover: '/bento/art.jpg',
    size: 'hero',
    tone: 'sand',
    detail: {
      intro:
        'I draw. Not for a brief and not for a client — it is where the eye gets trained. This is a growing set of sketches, studies and finished pieces.',
      facts: [
        { label: 'Medium', value: 'Pencil · Digital' },
        { label: 'Years', value: '2024 — 2026' },
        { label: 'Pieces', value: 'Growing' },
        { label: 'For', value: 'Myself' },
      ],
      slices: [
        {
          span: 'full',
          heading: 'Gallery',
          body: 'Drop your drawings into public/art/ and list them here — one slice per piece, or a few per row.',
          image: '/bento/art.jpg',
          caption: 'Placeholder — replace with your own work.',
        },
      ],
    },
  },
  {
    slug: 'form-design',
    group: 'craft',
    title: 'Form Design',
    tagline: 'A long form that feels short',
    blurb: 'Clear labels, forgiving validation and obvious progress.',
    year: '2025',
    tags: ['Forms', 'UX'],
    emoji: '📝',
    cover: '/bento/invoice.jpg',
    behance: 'https://www.behance.net/gallery/217305465/Form-Design-%28Task%29',
    size: 'small',
    tone: 'blush',
    kind: 'practice',
  },
  {
    slug: 'smartwatch',
    group: 'craft',
    title: 'Smartwatch',
    tagline: 'One idea per screen',
    blurb: 'Watch faces and app screens built for a glance — big targets, legible in sunlight.',
    year: '2024',
    tags: ['Wearable', 'UI'],
    emoji: '⌚',
    cover: '/bento/valley.jpg',
    behance: 'https://www.behance.net/gallery/215590509/Smartwatch-Design',
    size: 'small',
    tone: 'sage',
    kind: 'practice',
  },
  {
    slug: 'google-map',
    group: 'craft',
    title: 'Maps — event feature',
    tagline: 'A concept that fits the patterns',
    blurb: 'Nearby events added to Maps, designed to sit inside the existing patterns rather than fight them.',
    year: '2024',
    tags: ['Feature design', 'Concept'],
    emoji: '🗺️',
    cover: '/bento/maintenance.jpg',
    behance: 'https://www.behance.net/gallery/215585615/Google-map-%28Event-feature%29',
    size: 'small',
    tone: 'mist',
    kind: 'practice',
  },
  {
    slug: 'phone-call-flow',
    group: 'craft',
    title: 'Phone-call flow',
    tagline: 'Fewer mis-taps mid-call',
    blurb: 'A rethink of the calling experience and a clearer path back out of it.',
    year: '2024',
    tags: ['User flow', 'Mobile'],
    emoji: '📞',
    cover: '/bento/contact.jpg',
    behance: 'https://www.behance.net/gallery/215587351/Enhancing-User-flow-%28Phone-call%29',
    size: 'small',
    tone: 'sand',
    kind: 'practice',
  },
  {
    slug: 'neomorphism',
    group: 'craft',
    title: 'Neomorphism',
    tagline: 'Soft UI, pushed as far as it goes',
    blurb: 'A visual exploration that keeps contrast usable while chasing the style.',
    year: '2024',
    tags: ['Visual design', 'Exploration'],
    emoji: '🫧',
    cover: '/bento/support-flow.jpg',
    behance: 'https://www.behance.net/gallery/215586815/Neomorphism-Design',
    size: 'small',
    tone: 'cream',
    kind: 'practice',
  },
]

/** The two bento blocks, in order. */
export const groups = [
  { id: 'product' as const, label: 'Product & UI/UX', note: 'Shipped tools and interface work, with case studies.' },
  { id: 'craft' as const, label: 'Craft & explorations', note: 'Drawings, branding, motion and self-set studies.' },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

export type Role = {
  company: string
  title: string
  period: string
  points: string[]
}

export const experience: Role[] = [
  {
    company: 'Facilio',
    title: 'Frontend Engineer',
    period: '2022 — Present',
    points: [
      'Build and maintain product UI across web clients used daily by facility teams.',
      'Own shared component and design-system work that several product squads build on.',
      'Ship internal tools that shorten support and onboarding loops.',
    ],
  },
  {
    company: 'Earlier',
    title: 'Web Developer',
    period: '2020 — 2022',
    points: [
      'Built client-facing sites and dashboards end to end.',
      'Moved legacy pages onto a component-driven frontend.',
    ],
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Core', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
  { group: 'Frameworks', items: ['React', 'Vite', 'Next.js', 'Ember'] },
  { group: 'Styling', items: ['Design tokens', 'Tailwind', 'CSS architecture'] },
  { group: 'Practice', items: ['Accessibility', 'Performance', 'Design systems', 'Testing'] },
]

export const sections = [
  { id: 'top', label: 'Home' }, // the opening screen
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'awards', label: 'Awards' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export const sectionIds = sections.map((s) => s.id)

/** The nav button: resting label and the one that slides in on hover. */
export const navCta = { label: 'Contact Me', hover: "Let's Talk." }

// ── Stickers on the hero (drag them around) ───────────────
// x/y are % offsets inside the hero visual column. rotate in degrees.
export type Sticker = { label: string; emoji: string; x: number; y: number; rotate: number; tone: 'cream' | 'mint' | 'sky' | 'peach' | 'lilac'; depth: number }

export const stickers: Sticker[] = [
  { label: 'Designer', emoji: '✏️', x: 2, y: 6, rotate: -8, tone: 'peach', depth: 1.2 },
  { label: 'Vibe coder', emoji: '⚡', x: 60, y: 2, rotate: 7, tone: 'mint', depth: 0.8 },
  { label: 'Open to work', emoji: '👋', x: 56, y: 80, rotate: -5, tone: 'sky', depth: 1.0 },
  { label: 'Chennai', emoji: '☕', x: 0, y: 72, rotate: 9, tone: 'cream', depth: 1.5 },
  { label: '3D room soon', emoji: '🏠', x: 26, y: 90, rotate: -3, tone: 'lilac', depth: 0.6 },
]

// ── Scrolling strip under the hero ───────────────────────
export const marquee = [
  'React', 'TypeScript', 'Design systems', 'Vibe coding', 'Three.js', 'Figma', 'Accessibility',
  'Vite', 'CSS', 'Motion', 'AI chatbots', 'Product UI',
]

// ── Awards & certificates (PLACEHOLDERS — replace with real ones) ──
export type Award = { title: string; issuer: string; year: string; note?: string; kind: 'award' | 'certificate' | 'hackathon' }

export const awards: Award[] = [
  { title: 'Best Frontend Project', issuer: 'Company Hackathon', year: '2025', note: 'Built a live dashboard in 24 hours with a team of three.', kind: 'hackathon' },
  { title: 'Design Excellence Award', issuer: 'Internal design review', year: '2024', note: 'For the shared component library adopted across squads.', kind: 'award' },
  { title: 'Front-End Developer Certificate', issuer: 'Meta · Coursera', year: '2023', kind: 'certificate' },
  { title: 'Rising Star', issuer: 'Engineering team', year: '2023', note: 'Fastest ramp-up on the product team.', kind: 'award' },
]

// ── Opening intro (image hero) ────────────────────────────
// Background: the clip at public/intro.mp4 (1920×1080, 10 s, loops) with public/intro.jpg shown
// underneath while it loads. Set image to '/intro.jpg' to use the still picture (with CSS cloud/mist
// motion) instead of the clip. Missing files → drawn sunset scene.
export const intro = {
  image: '', // '' = use the video
  poster: '/intro.jpg', // still shown under the video while it loads
  imageFocus: '60% 50%', // which part of the picture stays in view when cropped (person is right of centre)
  video: '/intro.mp4',
  videoDark: '/intro-dark.mp4', // night version, crossfaded in when the theme is dark
  zoom: false, // CSS push-in for the video (leave off — the clip has its own motion)
  loop: true,
  headline: ['I Design And Build', 'For The Web.'],
  punch: 'Karthikeyan.', // the serif word that ends the headline
  paragraph:
    'Frontend Engineer From Chennai. I Turn Fuzzy Ideas Into Interfaces That Hold Up Under Real Users — Design Systems, Data-Heavy Screens, And The Tools Teams Actually Use.',
  placeholder: 'Your email here…',
  cta: ['Say', 'Hello.'], // second word is set in the serif
  toolsLabel: 'Working With',
  tools: [
    { name: 'Figma', style: 'serif' },
    { name: 'React', style: 'sans' },
    { name: 'TypeScript', style: 'heavy' },
    { name: 'Vite', style: 'wide' },
  ] as { name: string; style: 'serif' | 'sans' | 'heavy' | 'wide' }[],
  voice: "Hi, I'm Karthikeyan. I design and build for the web. Welcome — take a look around.",
}
