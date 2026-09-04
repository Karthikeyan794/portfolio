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
}

export const socials: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/' },
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
  href?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: 'Design System',
    blurb:
      'A shared component library and token set — accessible primitives, light/dark theming, and documentation that keeps product teams building from the same vocabulary.',
    year: '2025',
    tags: ['React', 'TypeScript', 'Tokens', 'a11y'],
    featured: true,
  },
  {
    title: 'Labs Client',
    blurb:
      'A web + mobile monorepo sharing one core package — credit accounting, per-team usage views and an approval flow, all driven by the same typed client.',
    year: '2025',
    tags: ['Monorepo', 'React', 'Vite'],
    featured: true,
  },
  {
    title: 'Support Assistant',
    blurb:
      'An LLM-backed helper that reads support history and drafts grounded replies, with the retrieval and evaluation loop that keeps its answers honest.',
    year: '2024',
    tags: ['LLM', 'Node', 'RAG'],
  },
  {
    title: 'Web Forms',
    blurb:
      'A schema-driven form renderer — conditional logic, validation and layout described as data instead of hand-written screens.',
    year: '2024',
    tags: ['React', 'JSON Schema'],
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
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export const sectionIds = sections.map((s) => s.id)
