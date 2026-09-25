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
  phone: '',
  resumeUrl: '', // e.g. '/resume.pdf' — drop the file in /public
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

/** The greeting and the two or three short paragraphs beside it. */
export const intro_about = {
  greeting: "Hey, I'm Karthikeyan!",
  paragraphs: [
    "I'm a product designer who builds. I go deep on research to find the real problem, design the solution in Figma, then build it with React — vibe coding my way to something that actually ships.",
    "At Facilio I designed and built Support Desk, a ticket app with a chat assistant in Teams, and designed Atom AI, our gallery of AI apps for facility teams.",
    "Away from work I draw, edit video, and keep side projects going — like Clickly, one dashboard for every social platform.",
  ],
}

/** The compact role list on the left — a summary; the timeline below has the detail. */
export const roleList: { org: string; role: string; years: string }[] = [
  { org: 'Facilio', role: 'Product Designer', years: '2025 — Present' },
  // TODO: the resume doesn't date these two — add the years.
  { org: 'Amvion Labs', role: 'UI + Graphic Design Intern', years: '' },
  { org: 'T-Eurasia', role: 'Creative Designer', years: '' },
]

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
export const awardsCard = { image: '/work/neomorphism.jpg' }

/**
 * What's on while I build.
 *
 * `src` is intentionally empty: I can't ship Anirudh's tracks with the site —
 * they're copyrighted and not mine to distribute. Drop your own MP3s in
 * /public/music and point `src` at them ('/music/the-one.mp3') and the player
 * below starts working immediately. Until then the card links out to Spotify.
 *
 * `art` is a drawn gradient rather than real cover art, for the same reason.
 */
export type Track = { title: string; artist: string; src: string; art: string; cover?: string }
export const playlist = {
  title: 'On repeat while building',
  // TODO: paste your playlist's Spotify share link — the ↗ only appears once
  // this points at a real playlist instead of Spotify's front page.
  href: '',
  /** Plays muted behind the crate. '' hides it and the card falls back to the card ground. */
  video: '/music/playlist-bg.mp4',
  tracks: [
    // TODO: save the AA23 poster to public/music/art/aa23.jpg and this picks it up.
    { title: 'The One', artist: 'Anirudh Ravichander', src: '', art: 'linear-gradient(145deg, #1db954, #0b3d22)', cover: '' },
    { title: 'Arabic Kuthu', artist: 'Anirudh Ravichander', src: '', art: 'linear-gradient(145deg, #f2994a, #6b2d12)' },
    { title: 'Vaathi Coming', artist: 'Anirudh Ravichander', src: '', art: 'linear-gradient(145deg, #56ccf2, #10394d)' },
    { title: 'Why This Kolaveri Di', artist: 'Anirudh Ravichander', src: '', art: 'linear-gradient(145deg, #eb5757, #4a1212)' },
    { title: 'Jolly O Gymkhana', artist: 'Anirudh Ravichander', src: '', art: 'linear-gradient(145deg, #bb6bd9, #3a1547)' },
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
  portrait: '/intro.jpg', // swap for a photo of you when you have one
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
  embed?: { src: string; pages?: { label: string; hash: string; role?: 'admin' | 'support' | 'viewer'; hint?: string }[]; art?: string }
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
  /** a short row of tools on the tile — keys from src/logos.ts `marks` */
  tools?: string[]
  /** which bento block this belongs to */
  group: 'product' | 'craft'
  /** its place on the home grid, 1 first — everything else lives on Behance */
  featured?: number
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
    group: 'product',
    title: 'Support Desk',
    tagline: 'A shared mailbox, turned into a support system',
    blurb:
      'Support ran on one shared Outlook mailbox, and a ticket that is only an email has no owner, no status, no clock and no customer. I sat with the team, collected the Microsoft access first, drew the flow, and built the desk on the tenant we already pay for: assignment that lands in Teams, a reply that opens already written, SLA clocks, saved views, a derived customer directory and role-based access — with the mailbox, the intake flow and the SharePoint list underneath left exactly where they were.',
    year: '2025',
    role: 'Product owner / designer',
    tags: ['Product', 'React', 'Microsoft Graph', 'Teams bot'],
    tools: ['microsoft', 'figma', 'claude'],
    emoji: '🎧',
    cover: '/bento/support-desk.jpg',
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
        { label: 'Built', value: '~6 weeks, part-time' },
        { label: 'Stack', value: 'React · Graph · SharePoint · Power Automate' },
        { label: 'Status', value: 'In daily use · ~900 tickets' },
      ],
      hook: {
        // a short lead, so the ending is the thing that lands — and every
        // ending is two or three words, so the slot never swings far
        lead: 'Every request now has',
        words: ['an owner.', 'a status.', 'a clock.', 'a reply.'],
      },
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
    group: 'product',
    title: 'Atom',
    tagline: 'Small AI apps, built and shipped fast',
    blurb:
      'A platform for small AI-powered apps — request one, watch it get built, then run it. I designed the catalogue, the request and approval flow, and the credit accounting behind it.',
    year: '2025',
    role: 'Design + Frontend',
    tags: ['AI', 'Platform', 'Dashboard'],
    tools: ['claude', 'figma'],
    emoji: '⚛️',
    cover: '/bento/atom.jpg',
    featured: 2,
    size: 'wide',
    tone: 'mist',
    kind: 'work',
    demo: { label: 'Try the demo', href: '' },
    detail: {
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

// TODO: add the years — the two Vibeathons need them to read apart.
export const awards: Award[] = [
  { title: 'Vibeathon', issuer: 'Zoho', year: '', kind: 'hackathon' },
  { title: 'Vibeathon', issuer: 'Zoho', year: '', kind: 'hackathon' },
  { title: 'Inktober', issuer: 'Zoho', year: '', kind: 'award' },
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
    'Product Designer From Chennai. I Go Deep On Research To Find The Real Problem, Design It In Figma, Then Build It In React.',
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
