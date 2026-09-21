// ─────────────────────────────────────────────────────────────
// Everything you'd want to edit lives in this file.
// Swap the copy, projects and links — the UI adapts.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Karthikeyan B',
  role: 'Product Designer · Front-end Developer',
  location: 'Chennai, India',
  available: true,
  availableNote: 'Open to Product Designer & Design Engineer roles',
  tagline: 'Turning user problems into working products.',
  email: 'babubkarthikeyan@gmail.com',
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
  /** a drawn explanation instead of a screenshot — see components/Diagrams.tsx */
  diagram?: string
  /** a short screen recording of this flow — an mp4 or gif in /public, shown under the diagram */
  clip?: string
  /** an id, so the section nav can scroll to this slice */
  anchor?: string
  /** a problem → what I did pair, the way my Behance case studies read */
  pair?: { problem: string; solution: string }
  /** the numbers a slice landed on */
  stats?: { value: string; label: string }[]
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
  /** one paragraph, then the points under it */
  problem: { lead: string; items: string[]; close?: string }
  /** the same shape as the problem: one paragraph, then the points. Each
   *  point leads with the capability so the answer lines up with the complaint. */
  solution: { lead: string; items: string[]; close?: string }
  /** a card each, and a shot of the thing beside them */
  benefits: { lead: string; items: { title: string; text: string }[] }
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
    demo: { label: 'Try the demo', href: '' },
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
          // TODO: record the desk and drop the file in /public/work/support-desk/
          // — an .mp4 or a .gif here plays in place of the still, no other change.
          clip: '/work/support-desk/clips/overview.mp4',
        },
      },
      brief: {
        problem: {
          lead: 'Support arrives as email and lands in a shared mailbox. From that moment nobody can say what became of it — and at scale, what breaks is the fast, accurate answer the customer judges you on.',
          items: [
            'Has anyone replied yet? The shared mailbox does not say',
            'Is it closed, or still open with the customer waiting?',
            'Who owns it — and has somebody else already answered the same mail?',
            'What was the customer actually asking? You reread the whole thread to find out',
            'Replies go out from personal inboxes, so the next person picking it up sees no history',
            'How long has the customer been waiting? Nothing counts it against what you promised',
            'Which customers raise the most, and what about? No way to look',
          ],
        },
        solution: {
          lead: 'Support Desk keeps the mailbox and puts a desk around it. Same address, same inbox — except every mail becomes a request with an owner, a status, a clock and that customer’s history beside it.',
          items: [
            'Shared queue — every mail becomes a ticket with a number, an owner, a status and a clock',
            'Assignment and alerts — hand it to someone and they hear about it where they already work',
            'Reply in place — answer on the customer’s own thread, from the desk, with the conversation beside it',
            'A reply already written — a ticket opens with its template filled in, ready to read over and send',
            'One owner per mail — pick the person who answers it, and they are told the moment it becomes theirs, in Teams and by mail',
            'Response SLA — the clock runs from the moment it arrived, against the time you promised',
            'Customer view — every request that company has raised, sitting beside the one in front of you',
            'Insights — volume, repeat problems and your most frequent requesters in one view',
            'Nothing new to buy — it reads the mailbox and the accounts you already have',
          ],
        },
        benefits: {
          lead: 'What you get out of it, whether you are one person or twenty.',
          items: [
            { title: 'Nothing gets lost', text: 'Every request has an owner, a status and a place it lives.' },
            { title: 'No more “who is on this?”', text: 'The queue already answers it, so nobody asks across the room.' },
            { title: 'Faster first replies', text: 'The clock is measured against what you promised, not guessed at.' },
            { title: 'Nobody repeats themselves', text: 'The customer’s whole history sits beside the request.' },
            { title: 'Causes get fixed, not symptoms', text: 'Repeat problems and frequent requesters surface in one view.' },
            { title: 'Nothing new to buy', text: 'It runs on the mailbox and the accounts you already have.' },
          ],
        },
      },
      slices: [
        {
          span: 'full',
          chapter: 'How it works',
          heading: 'The queue you land on',
          body: 'One list, thirteen filters, search, sort, and a split you can drag — the screen the team lives in all day. Watch the reload beside the list: press it and the desk reads the mailbox again, and whatever has arrived since comes in as a new ticket at the top of the queue, numbered, unassigned and already on the clock. Nobody has to reopen Outlook to find out whether something new landed.',
          clip: '/work/support-desk/clips/queue.mp4',
        },
        {
          span: 'full',
          heading: 'Narrowing it to the one you want',
          body: 'Thirteen filters over the same list. Pick a status and the queue narrows to what is still open; add a customer and it narrows again to theirs. They stack, so “everything still open for this company” is two clicks rather than a search somebody retypes every morning — and the split beside it keeps the ticket you were reading.',
          clip: '/work/support-desk/clips/filter.mp4',
        },
        {
          span: 'full',
          heading: 'Flow 1 — who gets in, and what they can do',
          body: 'On load the app reads the shared inbox with your own token. A 403 or 404 is a genuine no, and a full-screen gate stands where the desk would be: pick read or read-and-reply, add a note, request. The desk opens on its own the moment real access exists. Any other failure — a timeout, a throttle, a dropped connection — is treated as access, because a blip must never lock out somebody who can actually work. Inside, there are three roles: admin reads, edits and manages who else has access; support reads, replies, assigns and changes status; viewer reads. Only admin can change the list, or the distinction would be decorative — and a few standing admins are hard-coded so the app can never lock every one of its owners out.',
          diagram: 'gate',
        },
        {
          span: 'full',
          heading: 'Flow 2 — assign it, and the person hears about it in Teams',
          body: 'Pick a person from a roster that Graph keeps honest — enabled, licensed members only, with a presence dot so you can see who is free before you hand a ticket over. Assigning writes the row; a Power Automate flow watching that list posts the card the app built, verbatim, into Teams. The card carries the ticket number, the customer, the subject and a link straight back into the desk, so the person knows whether it is theirs before they click. Their photo on it is the real Teams one, pulled from Graph and embedded in the card, with an initials badge when there is none.',
          diagram: 'assign',
        },
        {
          span: 'full',
          heading: 'Flow 3 — a reply that starts written',
          body: 'The composer opens on a template: greeting, the signature with its logo travelling as an inline attachment rather than a link, and the quoted thread underneath. Where the AI assistant has read the ticket, its suggestion sits beside that — read straight out of the ticket’s own SharePoint columns, in one of three honest states: answered, needs input, or no reading yet. No reading yet is the common case, not an error, so it never looks like one. The person edits, and the person sends: the suggestion is a starting point, never the last word. Unsent drafts live in SharePoint rather than the browser, so a reply started on a laptop is there on the desktop, with item permissions and an author filter on top, because half-written words are the most private thing this app holds.',
          diagram: 'aireply',
        },
        {
          span: 'full',
          heading: 'The thread, and the composer',
          body: 'SharePoint stores a deeplink, not a mail, so the app pulls the message id out of it and asks Graph for the real conversation — every message, recipients, inline images and attachments — rendered in a sandboxed iframe so nobody’s email HTML can reach the page around it. Reply, reply-all and forward sit right there, with recipient chips you can check before you send.',
          image: '/work/support-desk/3-thread.jpg',
          caption: 'The thread beside the record — the core of the app.',
        },
        {
          span: 'full',
          heading: 'Flow 4 — why a reply has to start as a draft',
          body: 'A reply is not a fresh mail. The app asks Graph to create a reply draft, which already carries the conversation id, the threading headers and the quoted history; the typed reply goes on top of that draft, and the draft is what gets sent. A plain send would start a new conversation — and the intake flow underneath would file it as a second ticket for the same problem. When somebody is missing Send As, Graph refuses with a send-as error and the app shows it rather than swallowing it.',
          diagram: 'reply',
        },
        {
          span: 'full',
          heading: 'Flow 5 — the view each person works in',
          body: 'Thirteen filters are powerful and exhausting to set twice. So a set of filters can be saved with a name, and the saved list splits in two — mine, and the ones the desk has shared — because “who else can see this” is the question people actually have about a saved filter. Sharing is decided when you save and changed from the same menu, and only the owner can rename, reshare or remove one: a shared view is somebody else’s work, and quietly editing it under them is how people stop sharing.',
          diagram: 'views',
        },
        {
          span: 'full',
          heading: 'Flow 6 — the customer, derived from the mail itself',
          body: 'No customer table existed and I could not create one. So the app derives it from the only thing the list already had: the sender’s address. The domain becomes the account, the local part becomes the person, and both sides normalise to one key so the same customer never lands twice. That is what makes “which customer raises the most” answerable at all — it was one of the six asks, and it needed no data entry from anybody.',
          diagram: 'derive',
        },
        {
          span: 'full',
          heading: 'The customer view it produces',
          body: 'Three columns: every account, the people inside one account, and that person’s tickets. Nobody typed a customer in and nobody keeps it current — a new address creates its person the first time they write.',
          image: '/work/support-desk/6-customers.jpg',
          caption: 'Accounts → people → their tickets.',
        },
        {
          span: 'full',
          heading: 'Flow 7 — the clock we actually promise',
          body: 'Two clocks, because a ticket owes two different things: an answer, and a finish. Both start when the mail arrived and neither restarts. Targets live on the customer’s own row, one column per clock, so giving a customer an SLA is a data edit rather than a release — and a blank column means no promise of that kind, which is silence rather than zero. Response defaults to three hours because I measured it: across the 96 tickets belonging to customers with an SLA, a three-hour first reply was met 39 times out of 61, and a three-hour close was met zero times out of 58, with a median close of 504 hours. One of those is a target and the other is a wish, so resolution is left blank for somebody to set honestly.',
          diagram: 'sla',
        },
        {
          span: 'full',
          heading: 'Flow 8 — first, what the dashboard had to read',
          body: 'Before building a single chart I checked every column against all 670 rows rather than trusting the schema. Received date, description and mail link were filled on all 670. Assigned-to was filled on two. Escalated had been written 670 times and was true none. Sentiment, root cause, agent and both resolution timestamps had never been written at all. So the columns a dashboard would want to read were exactly the columns nobody was filling. The same pass found that 59% of what sat in the ticket list was the system’s own notifications, not customers.',
          diagram: 'audit',
        },
        {
          span: 'full',
          heading: 'So I shipped a dashboard that reads zero',
          body: 'Volume, intake trend, recurring problem types, who reports the most and who answers — all of that works, because it is computed from the ticket text and dates in the browser. Resolved-this-week, escalations and my-performance could only ever show zero. I shipped those widgets showing zero, with a line on the page saying nothing here is marked resolved, and took the finding to the team as a process problem rather than a UI one. Hiding them would have made the desk look finished and left the team blind.',
          image: '/work/support-desk/1-dashboard.jpg',
          caption: 'Volume, intake trend, recurring problems and repeat reporters.',
        },
        {
          span: 'full',
          heading: 'How a ticket gets its type',
          body: 'My first classifier read the whole email and labelled almost everything an implementation request — because these mails come from an implementation team and the phrase sits in every signature and quoted wrapper. Matching the subject first and treating the body only as a fallback fixed it. In email the signal is in the subject; the body is mostly other people’s text. It runs in the browser over tickets already loaded, so every number on the dashboard can be traced back to the tickets that produced it.',
          image: '/work/support-desk/5-requester.jpg',
          caption: 'Classification: ticket type, categories and product modules.',
        },
        {
          span: 'full',
          heading: 'Flow 9 — did every mail actually become a ticket?',
          body: 'This one exists because the answer was no for months and nothing said so. Mail sent to the customer-specific aliases was being ignored by the intake flow, and a missed mail leaves no trace — the only evidence would be a ticket that was never created. So the check counts both sides per address and puts them next to each other, because one broken alias disappears inside a healthy total. It counts conversations rather than messages: one customer conversation should be one ticket, and the mailbox holds around 21,000 messages behind roughly 900 tickets, so comparing raw totals would show a vast gap every day and mean nothing.',
          diagram: 'intake',
        },
        {
          span: 'full',
          heading: 'Flow 10 — the desk, from inside Teams',
          body: 'The last piece is a Teams bot, so the people who report problems never have to open the desk at all. @mention it in a chat or a channel and you can raise a ticket, ask for its status, comment, close it, reassign it to somebody you @mention, or ping a person without raising a ticket at all. Answers come back as Adaptive Cards with real profile photos from Graph and an initials badge when there is none. It runs end to end against a stubbed desk API today: the six calls it needs are marked in one file, and going live needs a tenant admin to register the identity and approve the photo permission.',
          diagram: 'teams',
        },
        {
          chapter: 'What broke',
          span: 'full',
          heading: 'The join that nearly duplicated a production list',
          body: 'I caught it because a customer I knew perfectly well rendered as “not saved”. One mismatched key, and the feature meant to keep two systems in step would have doubled a production list instead.',
          pair: {
            problem: 'The app keyed accounts by full domain, the list stored the bare label, so every lookup silently missed. The sync button compared those same two forms — it would have written 62 duplicate rows into a 145-row production list.',
            solution: 'Both sides normalise to one key before they compare or write. Nothing silently misses now, because a miss and a match are measured against the same string.',
          },
        },
        {
          span: 'full',
          heading: 'Left 248 tickets blank on purpose',
          body: 'The backfill wrote a type to 399 tickets. It could have written one to all 647.',
          pair: {
            problem: 'On 248 tickets no rule matched confidently. Filling them anyway would have made the column look complete, and a guess is indistinguishable from a fact once it is written — somebody reports on it a month later.',
            solution: 'Skip them. Blank is honest, wrong is expensive, and a visible gap is the thing that gets a rule written properly later.',
          },
        },
        {
          span: 'full',
          heading: 'An afternoon lost to one word',
          body: 'The kind of bug that is invisible in the code and obvious in the documentation.',
          pair: {
            problem: 'Every call to Freshdesk came back 401 invalid_credentials. The key was right and the account was right, so I read the client code again and again.',
            solution: 'Freshdesk wants Basic auth, and the credential had been saved as Bearer. One word in a settings page, an afternoon to find. The key itself never belonged in the bundle either — it stays server-side behind a proxy, because a key a browser can read is a key every signed-in tab can use.',
          },
        },
        {
          span: 'full',
          heading: 'A misdiagnosis I corrected',
          body: 'Worth writing down because the evidence was there the whole time and I read it backwards.',
          pair: {
            problem: 'A deploy started failing with a generic fetch error — nothing in the console, the page rendering fine. I concluded the browser had lost networking and looked in the wrong place for an afternoon.',
            solution: 'The API was answering with a redirect to the Microsoft login page, and a cross-origin redirect on fetch surfaces as exactly that generic error. The session had expired. I had read a 302 from the shell as “the site is up” instead of “the session is gone”.',
          },
        },
        {
          chapter: 'Where it landed',
          span: 'full',
          heading: 'What changed',
          body: 'A ticket now has an owner, a status, a clock and a customer — and the person who owns it finds out in Teams without opening anything. Replies leave from the desk on the same thread. And the team learned two things about its own data that nobody had seen before: most of the list was system noise, and mail to some of its own addresses had never been arriving at all.',
          stats: [
            { value: '6/6', label: 'of the asks from that first meeting are in daily use' },
            { value: '609', label: 'tickets classified in a single backfill — from 8 · 1 · 0 before' },
            { value: '62', label: 'customer accounts derived from the mail, with no data entry' },
            { value: '0', label: 'new licences, and no ticket data left the tenant' },
          ],
        },
        {
          span: 'full',
          heading: 'What I would do next',
          body: 'Get a resolution time actually written — the column exists and is writable, and filling it revives six dead metrics and half the intake chart. Finish the customer portal, so a customer can see their own tickets without mailing to ask. Put the Teams bot on a real identity instead of a stub. Fix sender attribution on forwarded threads, where a support reply is credited to the customer and skews the who-answers data. And make it responsive: it is desktop-only today, and the queue is the obvious phone screen.',
        },
        {
          span: 'full',
          anchor: 'demo',
          heading: 'Try it yourself',
          body: 'There is a runnable demo of the desk on generated data — the same layout, volumes and behaviour as production, with fictional companies, people and email bodies. No customer information appears in it, and it needs no sign-in and no internet.',
          // TODO: paste the hosted demo URL into `demo.href` above and it appears in
          // the page header too. Until then this reads as a description only.
        },
        {
          span: 'full',
          heading: 'Walkthrough',
          body: 'A run through the desk end to end — the gate, an approval, an assignment landing in Teams, then a reply going out on the same thread.',
          // TODO: record this and drop the file in /public/work/support-desk/,
          // or paste a YouTube/Loom URL. Shot list is in the demo package's
          // HELP-MAILBOX-ACCESS-FLOW.md, section 7. Per-flow clips go on each
          // flow slice as `clip: '/work/support-desk/clips/<name>.mp4'`.
          video: '',
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
