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
  href: 'https://open.spotify.com/',
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
  { label: 'Instagram', handle: 'add your handle', href: 'https://www.instagram.com/', mark: 'instagram', brand: '#E1306C' },
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
  /** a problem → what I did pair, the way my Behance case studies read */
  pair?: { problem: string; solution: string }
  /** the numbers a slice landed on */
  stats?: { value: string; label: string }[]
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
    tagline: 'A shared mailbox, turned into a support system',
    blurb:
      'Customer support ran out of one Outlook mailbox: 670 mails, no queue, no categories, no customer view. I measured what was there, found I had read-only rights to the schema, and built the desk that reads that same data — the live email thread over Microsoft Graph, a derived customer directory, a rules classifier and a Teams bot — without replacing the mailbox, the flow or the list the business already depended on.',
    year: '2025',
    role: 'Product owner / designer',
    tags: ['Product', 'React', 'Microsoft Graph', 'Teams bot'],
    emoji: '🎧',
    cover: '/bento/support-desk.jpg',
    size: 'hero',
    tone: 'sage',
    kind: 'work',
    // TODO: paste a hosted demo URL, or leave blank — the demo runs locally
    // from ~/Desktop/support-desk-demo via ./start-demo.command
    demo: { label: 'Try the demo', href: '' },
    detail: {
      intro:
        'Support ran out of a shared Outlook mailbox. A Power Automate flow copied each mail into a SharePoint list, which gave the team a record but not a system. Before I designed a screen I spent the first stretch measuring — how much mail, which columns were actually filled, and what my own account was allowed to do. Almost everything below is downstream of what that turned up.',
      facts: [
        { label: 'Role', value: 'Product owner / designer' },
        { label: 'Built', value: '~6 weeks, part-time' },
        { label: 'Stack', value: 'React · Microsoft Graph · SharePoint' },
        { label: 'Status', value: 'In daily use · 670 tickets' },
      ],
      slices: [
        {
          chapter: 'Research',
          span: 'full',
          heading: 'I counted before I designed anything',
          body: 'One shared mailbox, 670 tickets, about 29 new every day. The flow into SharePoint gave the team a record and nothing else. No queue, so whether a mail had been answered lived in somebody’s memory. No categories, so nobody could say what customers kept asking for. No customer view, so you could read one ticket but not what an account had raised this quarter, or who kept raising it. And the mail itself was still in Outlook, because the list only stored a link to it. The brief I wrote from that was deliberately narrow: read the data that already exists, and replace nothing underneath it.',
          diagram: 'system',
        },
        {
          span: 'full',
          heading: 'Then I measured the columns, and they were lying',
          body: 'I checked every column against all 670 rows instead of trusting the schema. Received date, description and mail link were filled on all 670. Assigned to was filled on two. Escalated had been written 670 times and was true zero times. Sentiment, root cause, agent and both resolution timestamps had never been written at all. The same pass turned up that 59% of what sat in the ticket list was the system’s own notifications rather than customers. So the columns any dashboard would want to read were exactly the columns nobody was filling.',
          diagram: 'audit',
        },
        {
          span: 'full',
          heading: 'What access I asked for — and what I actually got',
          body: 'I asked for room to add structure: a status column, a category column, ideally a small table for customers. What I got was delegated, user-level access — the app can only ever do what the signed-in person can do, and nothing beyond it. I measured that against the live site rather than assuming. Reading items worked, writing a field returned 200, creating an item returned 201, adding a column returned 403, creating a list returned 403. No new columns and no new tables. Every feature after this had to fit the columns that already existed or not ship, which is exactly why the customer directory is derived and the classifier writes into fields that were already sitting there.',
          diagram: 'access',
        },
        {
          span: 'full',
          heading: 'Two permissions everyone confuses',
          body: 'Reading and replying from that mailbox is not one permission, it is two — and neither of them belongs to the app. Full Access lets a person open the shared mailbox. Send As lets them reply so the customer sees the mailbox rather than the individual. Both are granted by an Exchange admin, take up to an hour to apply, and — the part that shaped the whole UI — there is no API to read whether somebody else has them, so the desk can never display “you have Send As”. What the app does own is its own role: admin, support or viewer. I agreed the split with the three people it crosses: IT, who alone can grant the mailbox; the support lead, who decides who belongs on the desk; and the person hitting the gate, who needs to know what to ask for. The rule that fell out of it is that an admin pressing Approve grants the app role only, and the dialog says so out loud instead of implying the click was enough.',
          diagram: 'permissions',
        },
        {
          chapter: 'The build',
          span: 'full',
          heading: 'The queue',
          body: 'One list, filters for type, category, module, customer, handler and status, plus search, sort and a split you can drag. Nothing clever — this is the screen the team lives in all day, so it loads fast, keeps your place and never buries a ticket behind a tab.',
          image: '/work/support-desk/2-queue.jpg',
          caption: 'The queue: filters, search and a resizable list/detail split.',
        },
        {
          span: 'full',
          heading: 'The email lives inside the app',
          body: 'SharePoint stores a deeplink, not a mail. The app pulls the message id out of that link and asks Microsoft Graph for the real conversation — every message, the recipients, inline images and attachments — and renders it in a sandboxed iframe so nobody’s email HTML can reach the page around it. That single move removed the daily round trip to Outlook.',
          image: '/work/support-desk/3-thread.jpg',
          caption: 'The thread beside the record — the core of the app.',
        },
        {
          span: 'full',
          heading: 'Draft first, then send',
          body: 'A reply is not a fresh mail. The app asks Graph to create a reply draft, which already carries the conversation id, the threading headers and the quoted history; the typed reply goes on top of that draft, and the draft is what gets sent. A plain send would start a new conversation, and the flow underneath would file it as a second ticket for the same problem. When the person is missing Send As, Graph refuses with a send-as error and the app shows it instead of swallowing it.',
          diagram: 'reply',
        },
        {
          span: 'full',
          heading: 'The composer',
          body: 'Reply, reply-all and forward sit on the record itself, with recipient chips you can check before you send, the quoted history kept underneath, and attachments carried through. The send control is only there for the people who can actually send.',
          image: '/work/support-desk/4-composer.jpg',
          caption: 'Reply, reply-all and forward, with recipient chips.',
        },
        {
          span: 'full',
          heading: 'The gate, and the three kinds of people who hit it',
          body: 'On load the app reads the shared inbox with the signed-in person’s own token. A 403 or 404 is a genuine no, and a full-screen gate stands where the desk would be: pick read or read-and-reply, add a note, request. The waiting screen offers a way out and a way forward, and the desk opens on its own the moment the real access exists. Any other failure — a timeout, a throttle, a dropped connection — is treated as access, because a blip must never lock out somebody who can actually do the work. A viewer sees every thread with reply and assign hidden and can ask for more. Support gets the full desk.',
          diagram: 'gate',
        },
        {
          span: 'full',
          heading: 'A dashboard that admits it reads zero',
          body: 'Resolved this week, escalations and my performance could only ever show zero. I shipped those widgets showing zero, with a line on the page saying nothing in this list is marked resolved, and took the finding to the team as a process problem rather than a UI one. Hiding them would have made the desk look finished and left the team blind; showing them started the conversation about who sets a status.',
          image: '/work/support-desk/1-dashboard.jpg',
          caption: 'Volume, intake trend, recurring problems and repeat reporters.',
        },
        {
          span: 'full',
          heading: 'Customers, derived from the mail itself',
          body: 'No customer table existed, and I could not create one. So the app derives it from the only thing the list already had — the sender’s address. The domain becomes the account, the local part becomes the person, and both sides normalise to one key so the same customer never lands twice. 62 accounts came out of it, with no data entry anywhere.',
          diagram: 'derive',
        },
        {
          span: 'full',
          heading: 'The directory it produces',
          body: 'Three columns: every account, the people inside one account, and that person’s tickets. Nobody typed a customer in and nobody has to keep it current — a new address creates its person the first time they write.',
          image: '/work/support-desk/6-customers.jpg',
          caption: 'Accounts → people → their tickets.',
        },
        {
          span: 'full',
          heading: 'Subject before body',
          body: 'My first classifier read the whole email and labelled almost everything an implementation request — because these mails come from an implementation team and the phrase sits in every signature and quoted wrapper. Matching the subject first and treating the body only as a fallback fixed it. In email the signal is in the subject; the body is mostly other people’s text. The rules assign a ticket type plus multi-label categories and product modules, all written into columns that already existed.',
          image: '/work/support-desk/5-requester.jpg',
          caption: 'Classification: ticket type, categories and product modules.',
        },
        {
          span: 'full',
          heading: 'The desk, inside Teams',
          body: 'The last piece is a Teams bot, so the people who report problems never have to open the desk at all. @mention it in a chat or a channel and you can raise a ticket, ask for its status, comment, close it, reassign it to somebody you @mention, or ping a person without raising a ticket at all. Answers come back as Adaptive Cards carrying real profile photos pulled from Graph, falling back to an initials badge when there is no photo. It runs end to end against a stubbed desk API today: the six calls it needs are marked in one file, and going live needs a tenant admin to register the identity and approve the photo permission.',
          diagram: 'teams',
        },
        {
          span: 'full',
          heading: 'Design decisions, made rather than defaulted',
          body: 'Three small rules. Values the app inferred look different from values a person confirmed — inferred is an outline, confirmed is filled — which let me delete an “AUTO” badge from every field. Thread avatars first took their colour from the address, and measuring showed white initials at 2.4:1 on some hues, so they became eight fixed fills, each checked at 4.5:1 or better for text. And every dropdown is a popover the app owns, so lists look and behave the same everywhere and flip themselves when they would overflow the panel.',
          diagram: 'rules',
        },
        {
          chapter: 'What broke',
          span: 'full',
          heading: 'The join that nearly duplicated a production list',
          body: 'I caught it because a customer I knew perfectly well rendered as “not saved”. One mismatched key, and the feature that was meant to keep two systems in step would have doubled a production list instead.',
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
          heading: 'A misdiagnosis I corrected',
          body: 'Worth writing down because the evidence was there the whole time and I read it backwards.',
          pair: {
            problem: 'A deploy started failing with a generic fetch error — nothing in the console, the page rendering fine. I concluded the browser had lost networking, and looked in the wrong place for an afternoon.',
            solution: 'The API was answering with a redirect to the Microsoft login page, and a cross-origin redirect on fetch surfaces as exactly that generic error. The session had expired. I had read a 302 from the shell as “the site is up” instead of “the session is gone”.',
          },
        },
        {
          chapter: 'Where it landed',
          span: 'full',
          heading: 'What changed',
          body: 'Replies now leave from the app; the old route was open Outlook and go and find it. And the team learned two things about its own data that nobody had seen before — most of the list was system noise, and assignment and resolution were effectively never being recorded.',
          stats: [
            { value: '670', label: 'tickets in one queue, with the email thread beside the record' },
            { value: '609', label: 'classified in a single backfill — type, categories and modules, from 8 · 1 · 0' },
            { value: '62', label: 'customer accounts derived from the mail, with no data entry' },
            { value: '59%', label: 'of the “tickets” turned out to be the system’s own notifications' },
          ],
        },
        {
          span: 'full',
          heading: 'What I would do next',
          body: 'Get a resolution time actually written — the column exists and is writable, and filling it revives six dead metrics and half the intake chart. Fix sender attribution on forwarded threads, where a support reply is currently credited to the customer and skews the who-answers data. Tighten the incident rule, which absorbs 61% of everything classified. And make it responsive: it is desktop-only today, and the queue is the obvious phone screen.',
        },
        {
          span: 'full',
          heading: 'Walkthrough',
          body: 'A run through the desk end to end — the gate, an approval, then a reply going out on the same thread.',
          // TODO: record this and drop the file in /public/work/support-desk/,
          // or paste a YouTube/Loom URL. Shot list is in the demo package's
          // HELP-MAILBOX-ACCESS-FLOW.md, section 7.
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
