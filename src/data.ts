// ─────────────────────────────────────────────────────────────
// Everything you'd want to edit lives in this file.
// Swap the copy, projects and links — the UI adapts.
// ─────────────────────────────────────────────────────────────

/**
 * Where "Your take" at the end of each case study goes — straight to the inbox.
 *
 * FormSubmit (formsubmit.co) turns a POST into an email with no account and no
 * key: the address is the endpoint. The very first submission does not arrive;
 * it sends a one-time "Activate Form" mail to this address instead. Click it
 * once and every note after that lands in the inbox.
 *
 * Any other form service that takes a JSON POST works in its place — Web3Forms
 * needs its `accessKey` as well. Left empty, a note opens the visitor's own
 * email app with it filled in, so nothing anyone writes is silently dropped.
 */
export const feedback = {
  endpoint: 'https://formsubmit.co/ajax/karthikeyan.design09@gmail.com',
  accessKey: '',
  // behind the "Share your words about it" tile, sharp, with a glass card on
  // it; the meadow with the paper plane (the same file the Support Desk demo
  // sits on). The other two tile pictures are in `endTiles` below.
  bg: '/work/support-desk/demo-bg.jpg',
}

/** the other two pictures in the bento at the end of every case study */
export const endTiles = {
  more: '/contact-sky.png', // behind "12+ more projects": the Milky Way
  contact: '/contact/night-library.webp', // behind Contact: the same picture the contact dialog sits on
}

export const profile = {
  name: 'Karthikeyan B',
  role: 'Product Designer · Front-end Developer',
  location: 'Chennai, India',
  available: true,
  availableNote: 'Open to Product Designer & Design Engineer roles',
  tagline: 'Turning user problems into working products.',
  email: 'karthikeyan.design09@gmail.com',
  // paste your number here and the contact dialog shows it; empty hides the
  // row entirely. Keep it in the form you want read aloud: '+91 98765 43210'.
  phone: '+91 78128 18507',
  // the résumé PDF in /public; the About links show it beside Behance ('' hides it)
  resumeUrl: '/Karthikeyan_B_CV.pdf',
  photo: '', // e.g. '/me.jpg' — drop the file in /public. Empty = initials placeholder.
}

export const socials: { label: string; href: string }[] = [
  { label: 'Behance', href: 'https://www.behance.net/karthikbabu13' },
  { label: 'GitHub', href: 'https://github.com/Karthikeyan794' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/b-karthikeyan-35192b28a' },
  // TODO: dropped from the footer — it pointed at x.com with no handle.
  // Put your own URL here and add it back.
  // { label: 'X', href: 'https://x.com/' },
]

/**
 * The contact band at the end of the home page: one line that animates in,
 * a short note, your links, and your mail — on a glass panel over `bg`.
 * The picture is your export, exact; swap the file to change it.
 */
export const contact = {
  heading: "Let's build something.",
  body: "The fastest way to reach me is email. I read everything, and reply to anything that isn't a template.",
  bg: '/contact-sky.png',
}

/** The greeting and the two or three short paragraphs beside it. */
export const intro_about = {
  greeting: "Hey, I'm Karthikeyan!",
  paragraphs: [
    "I'm a product designer who builds. I go deep on research to find the real problem, design the solution in Figma, then build it with React — vibe coding my way to something that actually ships.",
    "At Facilio I designed and built Support Desk, a ticket app with a chat assistant in Teams, and designed Atom AI, our gallery of AI apps for facility teams.",
    "Away from work I draw, edit video, and keep side projects going — like Clickly, one dashboard for every social platform.",
  ],
}

/** Education — from the resume. */
export const education: { school: string; course: string; years: string; logo?: string }[] = [
  { school: 'Web D Schools', course: 'Mastery UX/UI Designing', years: 'Jun 2024 — Jan 2025', logo: '/logos/webd.png' },
  { school: 'University of Madras', course: 'B.Com — Bachelor of Commerce', years: 'Jun 2021 — May 2024', logo: '/logos/madras.png' },
]

/**
 * The folder stack card — hover one and its tools lift out of the folder.
 * `mark` picks a brand glyph from src/logos.ts; without one the tile shows
 * `mono` instead. Drop an SVG in /public/logos and point `mark` at it later.
 */
export type Tool = { name: string; mark?: string; mono?: string }
/**
 * `image` shows behind a row while it's open. Your artwork, resized to
 * 1000px wide JPEGs — the originals are 1670px PNGs and live in
 * /assets-src/toolkit, out of the build.
 */
/** `shift` moves that row's crop: positive lifts the picture, negative drops it. */
export const stackCards: { no: string; label: string; image: string; shift?: number; tools: Tool[] }[] = [
  // TODO: Maze and Notion are my guess at your research tools — the resume
  // lists the skills (usability testing, personas) but not what you use.
  { no: '01', label: 'Research', image: '/toolkit/research.jpg', shift: -20, tools: [{ name: 'Maze', mark: 'maze' }, { name: 'Notion', mark: 'notion' }] },
  {
    no: '02',
    label: 'Design',
    image: '/toolkit/design.jpg',
    shift: -20,
    tools: [
      { name: 'Figma', mark: 'figma' },
      { name: 'Dora', mono: 'Do' },
      { name: 'Miro', mark: 'miro' },
      { name: 'Balsamiq', mono: 'Bq' },
    ],
  },
  {
    no: '03',
    label: 'Graphic', image: '/toolkit/graphic.jpg',
    tools: [
      { name: 'Photoshop', mono: 'Ps' },
      { name: 'Illustrator', mono: 'Ai' },
      { name: 'Canva', mono: 'Cv' },
      { name: 'CapCut', mono: 'Cc' },
    ],
  },
  {
    no: '04',
    label: 'Code', image: '/toolkit/code.jpg',
    tools: [
      { name: 'React', mark: 'react' },
      { name: 'JavaScript', mark: 'javascript' },
      { name: 'VS Code', mono: 'VS' },
      { name: 'GitHub', mark: 'github' },
    ],
  },
  {
    no: '05',
    label: 'Artificial Intelligence', image: '/toolkit/ai.jpg',
    tools: [
      { name: 'Claude', mark: 'claude' },
      { name: 'Cursor', mark: 'cursor' },
      { name: 'Lovable', mono: 'Lv' },
      { name: 'Midjourney', mono: 'MJ' },
    ],
  },
]

/**
 * The Recognition card's backdrop.
 * TODO: one of your own Behance covers standing in — swap it for a photo of
 * the trophies when you have them.
 */
// the Vibeathon 2026 trophy, held up against the sunset
// The card shows one line of type, no tags; `awards` below still feeds the lab.
export const awardsCard = { image: '/about/award.jpg', title: 'Vibeathon' }

/**
 * What's on while I build.
 *
 * The songs are in /public/music, exactly as downloaded (not re-encoded).
 * They are commercial film songs, shipped here by my choice: the rights are
 * the labels', and a takedown notice to GitHub could block the repo. If that
 * ever happens, empty each `src` and the card falls back to a quiet record.
 *
 * `art` is a drawn gradient for the record's label. The files' own cover art
 * carries a download site's watermark, so it is not used; set `cover` to a
 * clean image to replace a gradient.
 */
export type Track = { title: string; artist: string; src: string; art: string; cover?: string }
export const playlist = {
  title: 'On repeat while building',
  // TODO: paste your playlist's Spotify share link — the ↗ only appears once
  // this points at a real playlist instead of Spotify's front page.
  href: '',
  /** Behind the crate: still until a song plays, then it runs with it. '' hides it. */
  video: '/music/playlist-bg.mp4',
  tracks: [
    { title: 'I Am The Danger', artist: 'Anirudh Ravichander, Siddharth Basrur', src: '/music/i-am-the-danger.mp3', art: 'linear-gradient(145deg, #f2994a, #6b2d12)' },
    { title: 'Hangova', artist: 'Anirudh Ravichander, Heisenberg', src: '/music/hangova.mp3', art: 'linear-gradient(145deg, #eb5757, #4a1212)' },
    { title: 'Namaste', artist: 'Anirudh Ravichander', src: '/music/namaste.mp3', art: 'linear-gradient(145deg, #56ccf2, #10394d)' },
    { title: 'Thaalam Trip (Instrumental)', artist: 'Anirudh Ravichander, Shivapriya', src: '/music/thaalam-trip.mp3', art: 'linear-gradient(145deg, #1db954, #0b3d22)' },
    { title: 'Raga of Revenge × Paradise', artist: 'Background score', src: '/music/raga-of-revenge-x-paradise.mp3', art: 'linear-gradient(145deg, #bb6bd9, #3a1547)' },
    { title: 'AA23 BGM', artist: 'Background score', src: '/music/aa23-bgm.mp3', art: 'linear-gradient(145deg, #f2c94c, #5a4410)' },
  ] as Track[],
}

/** The three profiles that sit under the About text. */
export const aboutLinks: { label: string; handle: string; href: string; brand: string; mark?: string; mono?: string }[] = [
  // LinkedIn is absent from simple-icons, so it wears the 'in' monogram.
  { label: 'LinkedIn', handle: 'b-karthikeyan', href: 'https://www.linkedin.com/in/b-karthikeyan-35192b28a', mono: 'in', brand: '#0A66C2' },
  // TODO: your Instagram isn't on the resume — paste your handle and URL here.
  // Instagram: put the real handle in and uncomment — the bare domain is a dead link.
  // { label: 'Instagram', handle: 'your-handle', href: 'https://www.instagram.com/your-handle', mark: 'instagram', brand: '#E1306C' },
  { label: 'Behance', handle: 'karthikbabu13', href: 'https://www.behance.net/karthikbabu13', mark: 'behance', brand: '#1769FF' },
]

/**
 * The location card — two places, current and born, each with its own
 * picture behind the card. `pin` is kept for the drawn map fallback.
 */
export const places = [
  {
    key: 'current',
    label: 'Current',
    city: 'Chennai',
    country: 'India',
    coords: '13.0827° N, 80.2707° E',
    image: '/places/chennai.jpg',
    pin: { x: 58, y: 44 },
    // TODO: swap for your own share link if you want a specific spot
    href: 'https://www.google.com/maps/search/?api=1&query=13.0827,80.2707',
  },
  {
    key: 'born',
    label: 'Born',
    city: 'Villupuram',
    country: 'India',
    coords: '11.9401° N, 79.4861° E',
    image: '/places/villupuram.jpg',
    pin: { x: 45, y: 62 },
    href: 'https://maps.app.goo.gl/HnRycLDBaYb8xMud8',
  },
]

/** Both places share a timezone. */
export const place = { tzLabel: 'IST' }

/** The "currently" line in the portrait caption. */
export const currently = {
  role: 'Product Designer',
  at: 'Facilio',
  focus: 'Support Desk & Atom',
  portrait: '/about/portrait.jpg',
}

export const about = [
  'I work on the web side of building software: turning fuzzy product requirements into interfaces that hold up under real data, real users and years of iteration.',
  'Most of my time goes into three things — component libraries that stay consistent without slowing anyone down, data-heavy screens that stay responsive at scale, and the unglamorous internal tooling that quietly saves a team hours a week.',
]

/**
 * The four biggest recordings, plus the AI one, are served from a GitHub
 * release rather than from /public.
 *
 * Why: they are 146–268 MB each as exported, and GitHub rejects any file over
 * 100 MB outright, so they cannot be committed. Release assets allow 2 GB per
 * file, ride GitHub's CDN, answer byte-range requests (so a browser starts
 * playing before the file finishes) and — the point — do not count toward
 * repository size or the site's deploy. So the exports go up untouched.
 *
 * Until they are uploaded these URLs 404 and every clip falls back to the
 * smaller copy already in /public, so the page is never broken by their
 * absence. See ROADMAP.md 2g.
 */
const HD = 'https://github.com/Karthikeyan794/portfolio/releases/download/clips-v1'

export type Slice = {
  /** starts a new chapter above this slice — 'Research', 'The build', … */
  chapter?: string
  /** 'full' = wide row · 'half' = two per row */
  span?: 'full' | 'half'
  heading?: string
  body?: string
  image?: string
  caption?: string
  /** an embedded video: an mp4 in /public or a YouTube/Loom embed URL */
  video?: string
  /** a short screen recording of this flow — an mp4 or gif in /public, shown beside the words */
  clip?: string
  /** the copy to fall back to if `clip` will not load or will not play.
   *  Four of these recordings are 150–270 MB — over GitHub's 100 MB per-file
   *  limit — so the untouched exports live on a release and `clip` points out
   *  there. That URL is off this repo's deploy, so it can be missing (not
   *  uploaded yet) or served with a content type a browser refuses. Either way
   *  the page must not show a dead frame, so it drops to the copy in /public. */
  clipFallback?: string
  /** the still a clip shows while it loads — without one it is a black box */
  poster?: string
  /** an id, so the section nav can scroll to this slice */
  anchor?: string
  /** hide the 01 / 02 counter on this row — for a chapter that is one row long */
  unnumbered?: boolean
  /** a problem → what I did pair, the way my Behance case studies read */
  pair?: { problem: string; solution: string }
  /** the numbers a slice landed on */
  stats?: { value: string; label: string }[]
  /** the product itself, running in a window under the words */
  /** `roleKey`: the localStorage key the demo reads a page's `role` from (default 'sd.demoRole') */
  embed?: { src: string; pages?: { label: string; hash: string; role?: 'admin' | 'support' | 'viewer' | 'user'; hint?: string }[]; art?: string; roleKey?: string }
}

/** the plain-English layer: what it is, what it does, how a day on it goes */
export type Primer = {
  /** the line over each block; the block's own name sits above it as a small kicker */
  /** `what` is optional: the overview's big word says it already */
  heads?: { what?: string }
  what: string
  /** the app itself, beside the overview: a still, or a clip once there is one */
  showcase?: { bg?: string; poster: string; clip?: string; note?: string }
}

/** the three panels under the overview: what was wrong, what answers it, and
 *  what the team actually gets out of it. One at a time, on a tab. */
export type Brief = {
  /** two paragraphs and the picture beside them. `image` is optional and
   *  fails quietly: wire the path first, drop the file in later. */
  problem: { lead: string; body: string; close?: string; image?: string }
  /** the same shape as the problem: two paragraphs, and a picture beside them */
  solution: { lead: string; body: string; close?: string; image?: string }
}

export type Project = {
  slug: string
  title: string
  /** the product's own mark, beside the title in the case study's banner */
  logo?: string
  /** one line under the title in the grid */
  tagline: string
  blurb: string
  year: string
  role?: string
  tags: string[]
  emoji: string // fallback when there is no cover image
  cover?: string
  /** the card's cover, moving: a recording laid over `cover`, muted, looping
   *  while the card is on screen; `poster` is its first frame. It plays in the
   *  case page's banner too; with `bannerDown` set it is pinned by its top
   *  edge that many px below the banner's top (0 = flush, nothing cut), the
   *  band above painted `bannerFill` (the clip's own edge colour). `ratio` is
   *  the clip's width / height: the banner grows to show it whole */
  coverClip?: { src: string; poster?: string; ratio?: number; bannerDown?: number; bannerFill?: string }
  /** the Behance gallery for this project — shown as a link inside its page */
  behance?: string
  /** still being made: its card opens a short "working on it" note (see
   *  `inProgressNote`) instead of a page or Behance, and wears the tag */
  inProgress?: boolean
  /** a live demo people can try */
  demo?: { label: string; href: string }
  /** how big the tile is in the bento grid */
  size?: 'hero' | 'wide' | 'tall' | 'small'
  /** the tile's tint — kept pale so the primary green stays special */
  tone?: 'cream' | 'sage' | 'mist' | 'blush' | 'sand' | 'lime'
  /** 'work' = real/client · 'practice' = course or self-set exercise */
  kind?: 'work' | 'practice'
  /** a short row of tools on the tile — keys from src/logos.ts `marks` */
  tools?: string[]
  /** which bento block this belongs to */
  group: 'product' | 'craft'
  /** its place on the home grid, 1 first — everything else lives on Behance */
  featured?: number
  /** the newest work: a glass "Latest" tag beside the year on its tile */
  latest?: boolean
  /** when present the tile opens a case-study page instead of an external link */
  detail?: {
    facts: { label: string; value: string }[]
    /** a line under the title whose ending keeps changing */
    hook?: { lead: string; words: string[] }
    /** the plain-English opener, before any of the process */
    primer?: Primer
    /** problems beside solutions, then the goals — the opening spread */
    brief?: Brief
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
    latest: true,
    group: 'product',
    title: 'Support Desk',
    logo: '/work/support-desk/logo.svg',
    tagline: 'A shared mailbox, turned into a support system',
    blurb:
      'Support ran on one shared Outlook mailbox, and a ticket that is only an email has no owner, no status, no clock and no customer. I sat with the team, collected the Microsoft access first, drew the flow, and built the desk on the tenant we already pay for: assignment that lands in Teams, a reply that opens already written, SLA clocks, saved views, a derived customer directory and role-based access — with the mailbox, the intake flow and the SharePoint list underneath left exactly where they were.',
    year: '2025',
    role: 'Product owner / designer',
    tags: ['Product', 'React', 'Microsoft Graph', 'Teams bot'],
    tools: ['microsoft', 'figma', 'claude'],
    emoji: '🎧',
    cover: '/bento/support-desk.jpg',
    // the card plays the Support Desk intro (dark) over the still; the still
    // stays as its poster, since the clip opens on a black frame
    coverClip: { src: '/work/support-desk/clips/intro-dark.mp4', poster: '/bento/support-desk.jpg', ratio: 3840 / 2160 },
    featured: 1,
    size: 'hero',
    tone: 'sage',
    kind: 'work',
    // TODO: paste a hosted demo URL, or leave blank — the demo runs locally
    // from ~/Desktop/support-desk-demo via ./start-demo.command
    demo: { label: 'Try the demo', href: '/demo/support-desk/index.html#/tickets' },
    detail: {
      facts: [
        { label: 'Role', value: 'Product owner / designer' },
        { label: 'Built', value: '2 weeks' },
        { label: 'Stack', value: 'Claude Code + Figma' },
        // where it plugs in: mail comes from Outlook, the assistant lives in Teams
        { label: 'Works with', value: 'Outlook · Microsoft Teams' },
      ],
      // no line under the title in the banner: the recording says it
      primer: {
        heads: { what: 'Overview' },
        what: 'Support Desk lets you *manage every customer request in one place*, on your own or as a team. Every question that comes in gets an owner, a status and a clock, with that customer’s whole history sitting beside it — so your team can reach people quickly, understand what they actually need, answer without hunting through an inbox, and keep the conversation going until the customer is happy. Nothing goes missing, nobody is asked to repeat themselves, and no one on your team has to guess who is handling what.',
        showcase: {
          note: 'Queue, thread, customer and reply — the whole desk on one screen.',
          poster: '/work/support-desk/2-queue.jpg',
          // The ticket page end to end. 3636x2160 and 636 MB as exported, so it is
          // served from the release rather than the repo — far past the 100 MB a
          // file may be here. The poster above is what shows until it can start.
          clip: `${HD}/overview.mp4`,
        },
      },
      brief: {
        problem: {
          lead: 'Support arrives as email. From the moment it lands in the shared mailbox, nobody can say what became of it — and what breaks is the thing a customer judges you on: a fast, accurate answer.',
          body: 'Has anyone replied yet? Is it closed, or still open with the customer waiting? Who owns it, and has somebody already answered the same mail? The mailbox answers none of that. Replies leave from personal inboxes, so whoever picks it up next sees no history; nothing counts how long the customer has waited against the time you promised; and there is no way to look at which customers raise the most, or what about.',
          image: '/work/support-desk/why-problem.png',
        },
        solution: {
          lead: 'Support Desk turns every email into a ticket with an *owner, status, and SLA clock*.',
          body: 'Teams can manage and reply to tickets from one place, while customer history stays connected to every request. Track ticket volume, status, team performance, and recurring issues to keep support organized. *Nothing gets missed, and every request has an owner.*',
          image: '/work/support-desk/why-solution.png',
        },
      },
      slices: [
        {
          span: 'full',
          chapter: 'How it works',
          heading: 'New tickets',
          body: 'When a customer sends an email to your shared support mailbox, Support Desk fetches it and creates a new ticket. A *1 New Ticket* tag appears when a new request arrives — reload the queue to fetch the latest emails and see the new ticket at the top.',
          clip: '/work/support-desk/clips/queue.mp4',
          poster: '/work/support-desk/2-queue.jpg',
          caption: 'A new request arrives, the tag appears, and a reload brings it to the top of the queue.',
        },
        {
          span: 'full',
          heading: 'The Ticket Thread',
          body: 'Open a ticket to see the complete conversation in one place. You can view all replies, recipients, CCs, and attachments along with the message they belong to. Reply, Reply All, or Forward directly from the ticket, so the conversation stays connected and organized.',
          clip: `${HD}/thread.mp4`,
          clipFallback: '/work/support-desk/clips/thread.mp4',
          caption: 'Every message with its from, its to, and whatever came attached.',
        },
        {
          span: 'full',
          heading: 'Write & Send Replies',
          body: 'Start with a ready-to-use reply template, including a greeting and signature. If AI assistance is available, it can suggest a reply based on the ticket conversation. You can edit the suggestion before sending, keeping you in control of the final response. Use the text editor to write and format your reply.',
          clip: `${HD}/reply.mp4`,
          clipFallback: '/work/support-desk/clips/reply.mp4',
          caption: 'The whole reply, start to finish: the template already in the box, the AI reading beside it, the edit, and the send.'
        },
        {
          span: 'full',
          heading: 'AI Assistance for Ticket Replies',
          body: 'The AI assistant reads the ticket conversation and suggests a response based on the context. You can review and edit the suggestion before sending, or ask the assistant for more help. The AI suggestion is always a draft — you stay in control of the final reply.',
          clip: `${HD}/ai-suggestions.mp4`,
          caption: 'Reply, with the draft already written — then the reading behind it, the diagnosis it ran, and what it could not check.',
        },
        {
          span: 'full',
          heading: 'Milo: Your Support Assistant in Teams',
          body: 'Milo is a bot that lets your team manage Support Desk tickets directly from Microsoft Teams. Ask Milo about open tickets, status, priority, assignee, customer, or SLA, and get the information instantly without opening the desk.',
          // uploaded by hand, so it carries the name GitHub gave the file — dots
          // where the spaces were. Renaming the asset needs a write to the release;
          // the address is simply matched to it instead.
          clip: `${HD}/Milio.workflow.chat.bot.in.term.mp4`,
          caption: 'Milo in a Teams chat: the open queue as a table, a status card for one ticket, a name it refuses to guess at, and who owns what.',
        },
        {
          span: 'full',
          heading: 'Assign & Manage Tickets',
          body: 'When you reply to a ticket, it is automatically assigned to you, or you can reassign it to another team member. You can also update the status, priority, type, category, customer, and dates. Required fields must be completed before closing a ticket.',
          clip: '/work/support-desk/clips/assign.mp4',
          caption: 'Auto-assign, the detail panel, and what Closed asks for.',
        },
        {
          span: 'full',
          heading: 'Assign & Notify',
          body: 'Assign a ticket to the right team member by selecting their name from the assignee list. Once assigned, the team member is notified in Teams that a ticket has been assigned to them, so they know it’s ready for their attention.',
          clip: `${HD}/Team.notified.with.assigned.mp4`,
          caption: 'From the roster to Teams: the flow’s card with the photo, and Milo’s own “now assigned to you”.',
        },
        {
          span: 'full',
          heading: 'Filter & Save Ticket Views',
          body: 'Use filters to quickly find tickets by status, assignee, customer, type, priority, and more. Combine filters to narrow down your results, then save them as a view for quick access. You can keep views private or share them with your team.',
          clip: `${HD}/views.mp4`,
          caption: 'The thirteen filters stacking over the queue, then saved as a named view — and who else can see it.',
        },
        {
          span: 'full',
          heading: 'Merge & Mark as Spam',
          body: 'If multiple tickets are about the same request, merge them into one ticket to keep the conversation and ownership in one place. Unwanted emails can be marked as spam and removed from the support queue without needing a reply.',
          clip: `${HD}/merge.mp4`,
          clipFallback: '/work/support-desk/clips/merge.mp4',
          caption: 'Two tickets merged into one, and junk marked spam out of the queue.',
        },
        {
          span: 'full',
          heading: 'Track Response Time & SLA',
          body: 'Track how quickly your team responds to and resolves tickets. Set response and resolution targets based on the customer’s SLA, with deadlines shown directly on the ticket. You can also filter tickets by date and export the records as *CSV, Excel, or PDF* for reporting.',
          clip: '/work/support-desk/clips/sla.mp4',
          caption: 'The two clocks on a ticket, the targets and time zone behind them, and the whole record out as a file.',
        },
        {
          span: 'full',
          heading: 'Customer & Contact Management',
          body: 'View all customers, their contacts, and the tickets associated with each person. Customer details are automatically created from incoming emails, keeping your customer directory up to date without manual entry.',
          clip: '/work/support-desk/clips/customers.mp4',
          caption: 'Accounts → people → their tickets, all of it derived from the sender’s address.',
        },
        {
          span: 'full',
          heading: 'Dashboard',
          body: 'Get a clear overview of your support activity, including ticket status, ticket volume, incoming trends, common issues, top customers, and team performance. Track key metrics in one place to quickly understand what’s happening across your tickets.',
          clip: `${HD}/home.mp4`,
          clipFallback: '/work/support-desk/clips/home.mp4',
          caption: 'The home dashboard: volume, intake, recurring problems — and the widgets that honestly read zero.',
        },
        {
          span: 'full',
          heading: 'User Roles & Access',
          body: 'Manage who can access the Support Desk and what they can do. Set roles such as *Admin, Support, and View Only*, and control permissions for replying, assigning tickets, and editing ticket details. You can also review and approve access requests from one place.',
          clip: `${HD}/Profile.menu.+.manage.access.mp4`,
          caption: 'Manage access from the profile menu: every user with a role, the requests waiting for a yes, and spam kept out of the queue without deleting anything.',
        },
        {
          heading: 'Support Desk on Mobile',
          body: 'The Support Desk is fully responsive, so it works on a phone as well as a laptop. The home screen shows your ticket counts at a glance, Tickets and Customers sit one tap away at the bottom, and a ticket opens with its email, details, AI summary, and comments as tabs. You can *read a thread and send a reply from wherever you are*.',
          clip: '/work/support-desk/clips/mobile.mp4',
          caption: 'Recorded at phone width: the home cards, the ticket list, the AI summary inside a ticket, and a reply sent from the same screen.',
        },
        {
          chapter: 'Demo',
          span: 'full',
          anchor: 'demo',
          heading: 'Click around, explore the features, and experience how Support Desk works in real time.',
          // No number on this one: the chapter holds a single row, and 01 above a
          // one-line invitation reads like the first of a list that never comes.
          unnumbered: true,
          embed: {
            src: '/demo/support-desk/index.html',
            // each tab opens the same desk signed in as a different kind of user,
            // so the two access flows can be tried, not just read about
            pages: [
              { label: 'Admin', hash: '#/tickets', role: 'admin', hint: 'Everything: reply, assign, edit fields, and manage who has access' },
              { label: 'View only access', hash: '#/tickets', role: 'viewer', hint: 'Read everything; press Reply and the desk asks an admin for edit access on your behalf' },
              { label: 'Reply access', hash: '#/tickets', role: 'support', hint: 'Reply, assign and edit fields — but not manage access' },
            ],
            art: '/work/support-desk/demo-bg.jpg',
          },
        },
      ],
    },
  },
  {
    slug: 'atom',
    latest: true,
    group: 'product',
    title: 'Atom Gallery',
    logo: '/work/atom/logo.svg',
    tagline: 'One place to find, switch on and pay for AI',
    blurb:
      'The console where a facilities team finds its AI: agents you open, assistants you switch on, and one shared pool of credits behind both. I designed and built the catalogue, the guide with its playgrounds, access and credits.',
    year: '2025',
    role: 'Design + Frontend',
    tags: ['AI', 'Platform', 'Dashboard'],
    tools: ['claude', 'figma'],
    emoji: '⚛️',
    cover: '/bento/atom.jpg',
    // the card and the case banner play the dark Atom intro (Atom_Intro_Dark, as exported)
    coverClip: { src: '/work/atom/clips/intro-dark.mp4', poster: '/work/atom/clips/intro-dark.jpg', ratio: 3840 / 2160 },
    featured: 2,
    size: 'wide',
    tone: 'mist',
    kind: 'work',
    demo: { label: 'Try the demo', href: '/demo/atom/index.html#/home' },
    detail: {
      facts: [
        { label: 'Role', value: 'Design + Frontend' },
        { label: 'Year', value: '2025' },
        { label: 'Stack', value: 'React · TypeScript · Vite' },
        { label: 'Status', value: 'In production' },
      ],
      // no line under the title in the banner: the logo and the name, and the
      // recording says the rest
      primer: {
        heads: { what: 'Overview' },
        what: 'Atom is *one console for every AI feature a team can use*. Agents are whole apps you open, like a helpdesk or a planner; assistants live inside the tools people already use, and you switch them on for everyone. Both sit on one page that answers the two questions anyone arrives with — *what do we have, and what could we have?* — with a guide and a playground for each one, and a single pool of credits that shows who spends what.',
        // the intro recording plays on the project's card instead (coverClip)
        showcase: {
          note: 'One console, five pages: home, requests, credits, users and buildings.',
          poster: '/work/atom/clips/overview.jpg',
          clip: '/work/atom/clips/overview.mp4',
        },
      },
      brief: {
        problem: {
          lead: 'The AI was there, but nobody could find it, and switching it on spent money nobody could see.',
          body: 'Agents lived on one page, the ones you could ask for on another, and assistants had no home at all. People could not tell what their team already had or what else there was. An admin had no single place to turn a feature on for everyone, and when they did, the shared credits went down with no sign of who was using them.',
        },
        solution: {
          lead: 'Atom puts *every agent and assistant on one page* that shapes itself to who you are.',
          body: 'Admins switch assistants on for the whole team and see who loses one before they switch it off. Members see what they have and ask for the rest, in one click. Each feature has a guide and a playground to try it right there. Requests, credits and access sit one step away, so *spending is never a surprise*.',
        },
      },
      // Every row is a recording of the demo (made-up data: northwind-fm.example).
      // The originals are in ~/Desktop/labs-atoms-portfolio-demo-old-ui-backup/Atom Portfolio Videos,
      // copied here byte for byte; each poster is one frame of its own clip.
      slices: [
        {
          span: 'full',
          chapter: 'How it works',
          heading: 'Everything on one page',
          body: 'Atom opens on one page with every agent and assistant on it. Agents you have say *Try Now*; once you have opened one, it says *Open*. For the rest, Contact sales opens a short form: pick a feature, say what you need, and send it to the team.',
          clip: '/work/atom/clips/home.mp4',
          poster: '/work/atom/clips/home.jpg',
          caption: 'Try Now on Helpdesk comes back as Open, then Contact sales sends a request to pilot Smart Finding.',
        },
        {
          span: 'full',
          heading: 'Switch on an assistant',
          body: 'Assistants work inside tools people already use, so an admin switches them on for everyone. Switching one off first shows *who will lose it*. The gear on each card holds a tool instruction that shapes how the assistant answers. Members see the same cards with Active or Request Access instead of a switch.',
          clip: '/work/atom/clips/assistants-on-off.mp4',
          poster: '/work/atom/clips/assistants-on-off.jpg',
          caption: 'Ask AI on, Work Assistant off with the people who lose it, a tool instruction saved, then the member view.',
        },
        {
          span: 'full',
          heading: 'Ask for an assistant',
          body: 'A member who needs an assistant clicks *Request Access*, and the card says Requested. The request lands in the admin\'s Requests page with the time it was sent. One click on Approve and the member\'s card turns *Active*, with its guide ready to open.',
          clip: '/work/atom/clips/request-assistant.mp4',
          poster: '/work/atom/clips/request-assistant.jpg',
          caption: 'Sophia asks for the Work Order Completion Validator, the admin approves it, and her card turns Active.',
        },
        {
          span: 'full',
          heading: 'When credits run out',
          body: 'Each member has a credit limit, shown as a pill in the top bar. When it runs out the pill turns red, Atom pauses, and one button sends *a request for more*. The admin picks how much to add, sees the new limit before confirming, and the member\'s pill updates.',
          clip: '/work/atom/clips/request-credits.mp4',
          poster: '/work/atom/clips/request-credits.jpg',
          caption: 'Sophia hits her 2,000-credit limit and asks for more, the admin adds 250, and her pill shows 2,000 / 2,250.',
        },
        {
          span: 'full',
          heading: 'Users & Permissions',
          body: 'Admins invite people to agents by email, several at once. For assistants they can add *a whole role* at once, like every Technician, give each person one credit limit, and switch on the assistants they need. The table keeps each person\'s role, assistants, limit and status.',
          clip: '/work/atom/clips/add-users.mp4',
          poster: '/work/atom/clips/add-users.jpg',
          caption: 'Two people invited to agents by email, then seven Technicians added to assistants with a 500-credit limit.',
        },
        {
          span: 'full',
          heading: 'Credit usage',
          body: 'The pill in the top bar shows the shared credits used and *how many are left*. View usage opens the spending by feature, agents and assistants side by side, or by person, so you can see who uses the most.',
          clip: '/work/atom/clips/credit-usage.mp4',
          poster: '/work/atom/clips/credit-usage.jpg',
          caption: 'The credit pill (18,580 of 25,000 used), then Credit Usage by feature and by user.',
        },
        {
          span: 'full',
          heading: 'A guide you can try',
          body: 'Every assistant has a guide: who it is for, where to find it and how to use it. Beside it sits a *Playground*, so you can try the assistant before switching it on. Ask AI answers a question about work orders; Text Assistant turns a rough note into a polite one.',
          clip: '/work/atom/clips/guide-playground.mp4',
          poster: '/work/atom/clips/guide-playground.jpg',
          caption: 'View Guide, Ask AI on open work orders, then Text Assistant makes a rough note professional.',
        },
        {
          chapter: 'Demo',
          span: 'full',
          anchor: 'demo',
          heading: 'Click around the console yourself — it runs on made-up data, so nothing you do is real.',
          unnumbered: true,
          embed: {
            src: '/demo/atom/index.html',
            // the tabs sign in as the admin or as a member; the demo reads the
            // role from labs.demo.role once, at start-up
            roleKey: 'labs.demo.role',
            pages: [
              { label: 'Admin', hash: '#/home', role: 'admin', hint: 'The admin: switch assistants on, approve requests, manage people and credits.' },
              { label: 'User', hash: '#/home', role: 'user', hint: 'A member: see what you have, ask for an assistant or more credits.' },
            ],
          },
        },
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
    featured: 4,
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
    featured: 5,
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
    title: 'Clickly',
    tagline: 'A logofolio, and the mark it is named after',
    blurb: 'Logo and identity work — construction, spacing and how each mark holds up small.',
    year: '2024',
    tags: ['Branding', 'Logo'],
    emoji: '✦',
    cover: '/bento/welcome.jpg',
    behance: 'https://www.behance.net/gallery/215584601/Logofolio-%28Clickly%29',
    inProgress: true,
    featured: 3,
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
          body:
            'Ink and pencil, mostly Inktober — a month of one drawing a day, which is where the Inktober win at Zoho came from. Studies and finished illustration alongside it. Scans are being shot properly before they go up here.',
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

/**
 * The drawings the Drawings card in About opens, in this order — your
 * photos of them, the exported files exactly (public/art). `title` is the
 * caption under each; `alt` is what a screen reader hears.
 */
export const artworks: { src: string; title: string; alt: string }[] = [
  { src: '/art/01-monsters.png', title: 'Two monsters', alt: 'An ink drawing of two monsters locked together, in a sketchbook held up against the sky' },
  { src: '/art/02-basketball.png', title: 'The girl with the ball', alt: 'A pencil drawing of a girl in a mask holding a basketball, her hair blowing' },
  { src: '/art/03-moonlit.png', title: 'Under the moon', alt: 'A painting of a couple under a tree before a full moon, one kneeling to propose' },
  { src: '/art/04-godzilla.png', title: 'Godzilla', alt: 'An ink drawing of Godzilla, every scale and spine drawn in' },
  { src: '/art/05-chained.png', title: 'The chained brute', alt: 'An ink drawing of a snarling brute wrapped in heavy chains' },
  { src: '/art/06-spider.png', title: 'Spider', alt: 'A drawing of a hairy spider that seems to stand up off the page' },
  { src: '/art/07-fortune-teller.png', title: 'The fortune teller', alt: 'An ink drawing of an old fortune teller gazing into a crystal ball' },
  { src: '/art/08-blossom-moon.png', title: 'Blossom and moon', alt: 'A painting of a pink blossom tree on a cliff against a huge moon' },
  { src: '/art/09-anklets.png', title: 'Anklets', alt: 'A painting of feet in silver anklets under a red skirt, on a red and orange ground' },
  { src: '/art/10-armoured.png', title: 'Armoured', alt: 'A drawing of a figure in sleek segmented armour' },
  { src: '/art/11-cat.png', title: 'The cat breaking through', alt: 'A drawing of a kitten tearing its way out through the page' },
]

/**
 * Where a project card goes, in one place so the home grid and the tiles at
 * the end of a case study always agree:
 * - 'wip': still being made — a short note opens (`inProgressNote`)
 * - 'behance': no case study of its own — its Behance gallery, in a new tab
 * - 'page': its case study, here
 */
export const cardMode = (p: Project): 'wip' | 'behance' | 'page' =>
  p.inProgress ? 'wip' : !p.detail && p.behance ? 'behance' : 'page'

/** what a project still being made says when its card is clicked */
export const inProgressNote = {
  tag: 'In progress',
  title: 'Working on it',
  body: "{title} is still being made — I'm working on it right now. The full story will be here soon.",
  close: 'Okay',
}

export type Role = {
  company: string
  /** a logo in /public/logos; without one the stepper shows a monogram */
  logo?: string
  /** short name for the stepper, when the legal one is a mouthful */
  short?: string
  title: string
  period: string
  /** shown on the rail — a short state, e.g. 'Now' or the year */
  marker: string
  place?: string
  points: string[]
  /** the tools that mattered in this role */
  stack?: string[]
  image?: string
}

export const experience: Role[] = [
  {
    company: 'Facilio',
    logo: '/logos/facilio.png',
    title: 'Product Designer',
    period: '2025 — Present',
    marker: 'Now',
    place: 'Chennai, India',
    points: [
      'Designed and built Support Desk — tickets, with a chat assistant in Teams.',
      'Designed Atom AI, our gallery of AI apps for facility teams.',
      'Ship my own Figma designs in React.',
    ],
    stack: ['Figma', 'React', 'Design systems', 'Vibe coding'],
    image: '/bento/support-desk.jpg',
  },
  {
    company: 'Amvion Labs',
    logo: '/logos/amvion.png',
    title: 'UI + Graphic Design Intern',
    // TODO: the resume doesn't date this one — add the years.
    period: 'Internship',
    marker: 'Intern',
    points: ['Web app UI and dashboards.', 'Reusable Figma components for the team.'],
    stack: ['Figma', 'UI design'],
    image: '/bento/welcome.jpg',
  },
  {
    company: 'T-Eurasia Business Communication',
    short: 'T-Eurasia',
    logo: '/logos/t-eurasia.png',
    title: 'Creative Designer',
    // TODO: the resume doesn't date this one either.
    period: 'Earlier',
    marker: 'Start',
    points: ['Website redesign and the TEB School platform.', 'Brand and social assets.'],
    stack: ['Photoshop', 'Illustrator', 'Branding'],
    image: '/work/tnpsc.jpg',
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
  { id: 'contact', label: 'Contact' },
] as const

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


// ── Awards & certificates (PLACEHOLDERS — replace with real ones) ──
export type Award = { title: string; issuer: string; year: string; note?: string; kind: 'award' | 'certificate' | 'hackathon' }

export const awards: Award[] = [
  { title: 'Vibeathon', issuer: 'Zoho', year: '', kind: 'hackathon' },
  { title: 'Inktober', issuer: 'Zoho', year: '', kind: 'award' },
]

// ── Opening intro (image hero) ────────────────────────────
// Background: the night-library picture at public/night-library.png, your export, exact. The page
// adds the motion itself: shelf light breathing, fireflies, a slight lean toward the pointer.
// Empty `image` falls back to `video` (none now — the mountain clips are gone). Missing file →
// drawn scene.
export const intro = {
  // Light theme: the library by day. Dark theme: the same library at night.
  // Switching theme crossfades between them, and each is only downloaded the
  // first time its theme is chosen. The night picture brings two effects of
  // its own — the shelf lights breathing and fireflies in the bushes — which
  // on the day one would wash out the sky and look like specks in the sun.
  // A set `image` wins over `video`.
  image: '/intro/day-library.webp',
  // a phone gets the same library by day, framed tall (your export, exact)
  imagePhone: '/intro/day-library-tall.png',
  // 40px copies of the three pictures, built into the page and blurred up to
  // full size while the real one downloads, so the wait looks like the
  // picture coming into focus. Remake them if a picture changes.
  blur: {
    day: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQsJCAwLCgsODQwOEh4UEhEREiUbHBYeLCcuLisnKyoxN0Y7MTRCNCorPVM+QkhKTk9OLztWXFVMW0ZNTkv/2wBDAQ0ODhIQEiQUFCRLMisyS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCAAXACgDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAMEBQYB/8QAKRAAAgEDAwEHBQAAAAAAAAAAAQIDAAQREiExBgUTQVFhcYEiMlKRsf/EABcBAQADAAAAAAAAAAAAAAAAAAMBBAX/xAAfEQEAAgICAgMAAAAAAAAAAAABAAIDEQQhEoEFQVH/2gAMAwEAAhEDEQA/AOWivZIljBkBzsQD9vzV+OWOXZXXVnGM+NYCtGrMvIbkHP01dsp4I9Q7gTqQMayRoPxzU48ziFIOXimW2iarRZFRNEcVPN2X2nbRrPPYXIjkXJkZiu+dthuPmou4mSE3EltKUjZS5Us2kfumrzqttJr3CfjrFGxbfqQNHSvJr9CWESAY/P8AvtSleXjlc4uSYxLvjhtXBxg+lX4ZrWxMRntZTIrBtfeDcg+XltSlZa96mxT9Z0PUPWbXV0NFqAkQKskjalck7nG1ZMnUUl9BJDHEttG7ljHbrpXjx3zSlRUPHcawFvH6leWBYhGzvIzEAkbY9PelKUZ2dyu3Z//Z',
    dayPhone: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQsJCAwLCgsODQwOEh4UEhEREiUbHBYeLCcuLisnKyoxN0Y7MTRCNCorPVM+QkhKTk9OLztWXFVMW0ZNTkv/2wBDAQ0ODhIQEiQUFCRLMisyS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCABHACgDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAUDBAYCAf/EAC4QAAIBAwMDAwIFBQAAAAAAAAECAwAEEQUSIRMxQSJRYTJxBgeBkbEUIySh0f/EABkBAAMBAQEAAAAAAAAAAAAAAAIDBQQAAf/EACYRAAICAQQABQUAAAAAAAAAAAECAAMRBBIhMRMiUWGRMkGh4fD/2gAMAwEAAhEDEQA/AEjLUbCpYp0uYw45Lc7QeFHvXjptOP4q1TctwyJAsqao4MrsK4IqciuCue3enYggyEiimdppf9VHI6TL/bXJGDkn2ope5c4jdrYziI7Jd8gIm2Mx9XOD9vanIZHUKHV2A7quAaQCynjO8Hog/QW7sD2wBVzS5blWaCJec4YHnb81G01pV8r17Tfqawy8/aMemSQAOTUqnoAhkVnHABHb5yPNSCJto3cNjnFHQUJuO4tnwOP3q5kEcyQCRIku5o4TEhwpbcfvRUd0xgVW4GT2PkfB8UVkfVUoxUiakpudQQYnmd2hVpmfaSMBj6s/f2pvp9g8Vsb2aMyFB6STxjwazss26JG3sxBxhvFOLa6vpikAmunjfAESLkMM9uOcVDDNX9MveALQcg8en5ksU940xliRyo5K7Se/mmkuq3UsCRyWUzsfQqqQqDj2/SlsiaxDfypLBNZRHLFApUt7YzUkdrcElpXuW5J+vsPHn2oVvetgGYAGMOlreskKSw/vWVJYrhpWt5Y+lFwXVzyo8fxRXV9CLO4kMrShvSCp5I7+c8/vRQOxZsoePaLWrA83c6XT7jUYPTaRJBjAnHo3Y8jPPet5+XVkLPS5ZHT/ACHl2licsFAwB8DOTWJuZtRklEVoctnDxscqoxxyf14+Kmg/EusW9jFJBcSRscrIOmNuQfSRkexpSvxgfuaBWpGQeZs9c1V7i/k08yRxQCJmZmYDsM+aQy6LJBZreyfiBArQ9QREZBBHAyM5P2rH3mqXFzIZLiVS+ckkAc1SXUJOqEYllB4TJwab4YbsT0NsG0HGZvNW1qzt7BbWyjSZgg3yOoOTjuSe5orPRC6u2iWa3h2YyuBggffIxRQDUJUNuM/EFqFY53Y+YqiuSknSLNgnBAPP3+atvfC6U29wingB3Yndjx24/wBUUU0oO5kDEGcLoq3TXDWpcpBggsR9Oe5/5Vyw0sWZjMojZZgWZZIgzKvbvmiisdtr52ZjhzzLk9ytrcvEWMBRukAoyrDjJI5xjiiiihFYZQTO3Gf/2Q==',
    night: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQsJCAwLCgsODQwOEh4UEhEREiUbHBYeLCcuLisnKyoxN0Y7MTRCNCorPVM+QkhKTk9OLztWXFVMW0ZNTkv/2wBDAQ0ODhIQEiQUFCRLMisyS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCAAXACgDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAQCAwUH/8QAJhAAAgEEAQIGAwAAAAAAAAAAAQIDAAQREiEFYQYTMUFRcRQigf/EABcBAQEBAQAAAAAAAAAAAAAAAAIDBAH/xAAbEQACAwEBAQAAAAAAAAAAAAAAAQIREgMEMv/aAAwDAQACEQMRAD8A51uVRcjZfcn2qJIPoRTtyEw0ceuGOdcrwfjj1qvp6w4lD26zEnA2kAC1OHSlZWXFuVCpHPNRIrfHRL2wjElx06QRSDJeUgEHPA7f2qb6wl/FkmWAhU121IIX7pLvFyoL88lHRiEUVNjrwcE/I9KKppEssvDzy4CODkfWPim4J4bJ4mkjn3Dhi4kH7EdqKKyP6yaoulZp9b8TvcdREq241hOAjtsG5zn2pO48QvfwPC0YgRn28uBAEz35oorqispilJ6aE3SNDGMsxxyDwO1FFFBhTP/Z',
  },
  imageDark: '/night-library.png',
  poster: '',
  imageFocus: '50% 50%', // which part of the picture stays in view when cropped (the reader is centre)
  video: '',
  videoDark: '', // empty: the one clip plays in both themes
  zoom: false,
  loop: true,
  // The line that types itself above the headline: the name first, then what
  // I do, then where. Each types, holds, and deletes before the next.
  hello: ["hi, i'm karthikeyan", 'product designer', 'front-end developer', 'based in chennai'],
  // The headline: the top line stays put (a word between *asterisks* is the
  // grey serif italic); the line under it turns over every few seconds and
  // finishes the sentence — what I make, then the tool, the tool in its own
  // colour with its logo popping in beside it. `mark` is a key in
  // src/logos.ts. Add a line to `headline` to add a turn. In the top line a
  // ` | ` is the one place it may break on a narrow screen (a phone), so it
  // splits into "Every day" / "I design & build" rather than orphaning a word.
  headlineTop: 'Every day | I *design* & *build*',
  headline: [
    { what: 'Interfaces', prep: 'in', tool: 'Figma', mark: 'figma', color: '#0ACF83' },
    { what: 'Front-end', prep: 'with', tool: 'Vibe Coding', mark: 'vibe', color: '#fad243' },
    { what: 'Vibe faster', prep: 'with', tool: 'Claude', mark: 'claude', color: '#ec9a76' },
  ] as { what: string; prep: string; tool: string; mark: string; color: string }[],
  paragraph:
    'Product designer from Chennai. I go deep on research to find the real problem, design it in Figma, then build it in React.',
  cta: { label: 'See my work', href: '#work' },
  // beside it: opens the contact dialog; `hover` is the label that slides in
  contactCta: { label: 'Contact me', hover: "Let's Talk.", href: '#contact' },
}
