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

export type Project = {
  title: string
  blurb: string
  year: string
  tags: string[]
  emoji: string // fallback when there is no cover image
  cover?: string // /work/*.jpg — downloaded from Behance so the site doesn't hotlink
  href?: string
  featured?: boolean
  /** 'work' = real/client · 'practice' = course or self-set exercise. Edit these freely. */
  kind?: 'work' | 'practice'
}

/**
 * Pulled from behance.net/karthikbabu13 (12 projects, newest first).
 * Blurbs are first drafts — rewrite any of them in your own words.
 */
export const projects: Project[] = [
  {
    title: 'Skill Mate — AI mock interview',
    blurb:
      'An AI-powered mock-interview product: practice sessions, question flow and feedback screens designed so a nervous candidate always knows what happens next.',
    year: '2025',
    tags: ['Product design', 'AI', 'UI/UX'],
    emoji: '🎤',
    cover: '/work/skill-mate.jpg',
    href: 'https://www.behance.net/gallery/230495131/Skill-Mate-AI-Powered-mock-interview',
    featured: true,
  },
  {
    title: 'Car Dashboard — dark & light',
    blurb:
      'An in-car dashboard in both dark and light modes — speed, media, navigation and climate kept glanceable at driving speed.',
    year: '2025',
    tags: ['Dashboard', 'Dark mode', 'UI'],
    emoji: '🚗',
    cover: '/work/car-dashboard.jpg',
    href: 'https://www.behance.net/gallery/230978875/Car-Dashboard-Dark-Light-mode',
    featured: true,
  },
  {
    title: '7 Days Redesign Challenge',
    blurb: 'Seven days, seven redesigns — a self-set sprint to practise moving fast from critique to a cleaner screen.',
    year: '2025',
    tags: ['Redesign', 'Challenge'],
    emoji: '📅',
    cover: '/work/redesign-challenge.jpg',
    href: 'https://www.behance.net/gallery/230895267/7-Days_Redesign-Challenge',
    kind: 'practice',
  },
  {
    title: 'Form Design',
    blurb: 'A long form broken into steps that feel short — clear labels, forgiving validation and obvious progress.',
    year: '2025',
    tags: ['Forms', 'UX'],
    emoji: '📝',
    cover: '/work/form-design.jpg',
    href: 'https://www.behance.net/gallery/217305465/Form-Design-%28Task%29',
    kind: 'practice',
  },
  {
    title: 'Nellai Karupatti Coffee Dashboard',
    blurb: 'An admin dashboard for a coffee brand — orders, stock and sales in one screen with the numbers that matter first.',
    year: '2025',
    tags: ['Dashboard', 'Data UI'],
    emoji: '☕',
    cover: '/work/coffee-dashboard.jpg',
    href: 'https://www.behance.net/gallery/217302653/Nellai-Karupatti-Coffee-Dashboard',
  },
  {
    title: 'POS School Management Dashboard',
    blurb: 'A school management and point-of-sale dashboard — fees, attendance and records for staff who are always in a hurry.',
    year: '2024',
    tags: ['Dashboard', 'POS', 'UI/UX'],
    emoji: '🏫',
    cover: '/work/pos-school.jpg',
    href: 'https://www.behance.net/gallery/214624079/POS-school-management-Dashboard',
  },
  {
    title: 'TNPSC Website Redesign',
    blurb:
      'A case study redesigning a government exam portal: the information aspirants actually need, found in fewer taps and readable on a cheap phone.',
    year: '2024',
    tags: ['Case study', 'Web', 'Accessibility'],
    emoji: '🏛️',
    cover: '/work/tnpsc.jpg',
    href: 'https://www.behance.net/gallery/214619697/TNPSC-website-Redesign-case-study',
    featured: true,
  },
  {
    title: 'Google Maps — event feature',
    blurb: 'A concept feature adding nearby events to Maps, designed to sit inside the existing patterns rather than fight them.',
    year: '2024',
    tags: ['Feature design', 'Concept'],
    emoji: '🗺️',
    cover: '/work/google-map.jpg',
    href: 'https://www.behance.net/gallery/215585615/Google-map-%28Event-feature%29',
    kind: 'practice',
  },
  {
    title: 'Enhancing a phone-call flow',
    blurb: 'A rethink of the calling experience — fewer mis-taps mid-call and a clearer path back out of it.',
    year: '2024',
    tags: ['User flow', 'Mobile'],
    emoji: '📞',
    cover: '/work/phone-call-flow.jpg',
    href: 'https://www.behance.net/gallery/215587351/Enhancing-User-flow-%28Phone-call%29',
    kind: 'practice',
  },
  {
    title: 'Smartwatch Design',
    blurb: 'Watch-face and app screens built for a glance — big targets, one idea per screen, legible in sunlight.',
    year: '2024',
    tags: ['Wearable', 'UI'],
    emoji: '⌚',
    cover: '/work/smartwatch.jpg',
    href: 'https://www.behance.net/gallery/215590509/Smartwatch-Design',
    kind: 'practice',
  },
  {
    title: 'Neomorphism Design',
    blurb: 'A soft-UI exploration — pushing the neomorphic style as far as it goes while keeping contrast usable.',
    year: '2024',
    tags: ['Visual design', 'Exploration'],
    emoji: '🫧',
    cover: '/work/neomorphism.jpg',
    href: 'https://www.behance.net/gallery/215586815/Neomorphism-Design',
    kind: 'practice',
  },
  {
    title: 'Logofolio — Clickly',
    blurb: 'Logo and identity marks, including the Clickly brand — construction, spacing and how each mark holds up small.',
    year: '2024',
    tags: ['Branding', 'Logo'],
    emoji: '✦',
    cover: '/work/logofolio-clickly.jpg',
    href: 'https://www.behance.net/gallery/215584601/Logofolio-%28Clickly%29',
  },
]

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
