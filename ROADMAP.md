# Portfolio — Plan & Checklist

> Read this file when you forget what we decided. We tick the boxes as things get done.
> Site goal: help Karthikeyan apply for jobs. Live URL: _(coming — Vercel)_

---

## 0. Direction (updated 7 Sep 2026)

- **2D site only for now.** The 3D lab is parked (code kept, hidden) — we come back to it later.
- **Design:** you send the colour theme → I apply it everywhere (tokens in `src/styles.css`).
- **Fonts:** **Roboto** for everything; **Playfair Display** for styled headings/accents (more display fonts later if wanted).
- **Mini projects:** your Behance / Figma design work — links + one cover image each.
- **Main project — Support Desk:** full case study page with demo videos.
- **Loader:** the sticker Rubik's cube stays as the site intro.

## 1. Quick answer to every requirement

| # | You want | Possible? | How (short) | Cost |
|---|----------|-----------|-------------|------|
| 1 | 3D room with desk, laptop, awards on wall, projects, contact, resume | ✅ Yes | Three.js + React Three Fiber. Click objects → open panels. | Free |
| 2 | AI chatbot that answers questions about you | ✅ Yes | Free LLM API (Groq / Gemini) + your info as its "memory". | Free tier |
| 3 | Add / update a project easily any time | ✅ Yes | Edit one file `src/data.ts`, or tell Claude "add project X". Auto-deploys. | Free |
| 4 | Know who visited the site | ⚠️ Partly | Country, device, pages, count = yes (analytics). Name/email = only if they type it (form / chatbot). | Free |
| 5 | Free database | ✅ Yes | Supabase (Postgres, free tier). Stores messages, chat logs, visitor emails. | Free |
| 6 | Interactive, stickers, "designer + vibe coding" feel | ✅ Yes | Lottie animations, Framer Motion, draggable SVG stickers. | Free |
| 7 | Research before building | ✅ | This file = the research. Add new ideas at the bottom. | — |
| 8 | Checklist file | ✅ | Section 3 below. | — |
| 9 | Short, simple answers in chat | ✅ | Rule saved in `CLAUDE.md` (Claude reads it every session). | — |
| 10 | Walk through the room like a game (Iron Man lab style) and explore | ✅ Yes | Character/first-person controls (WASD + mouse; joystick on phone), physics for walls, glowing hologram UI. | Free |
| 11 | AI voice welcomes and guides the visitor | ✅ Yes | Pre-recorded voice MP3 (ElevenLabs free) or browser voice (Web Speech API). Needs one "Enter" click first. | Free |

---

## 2. Details — one short block each

### 1 · 3D room  🏠

**How it works**
- The room is a 3D model (a `.glb` file) shown in the browser with **Three.js**.
- We use **React Three Fiber** (Three.js for React) + **Drei** (ready-made helpers).
- Objects are **hotspots**: click laptop → Projects panel · click wall frame → Awards · click phone → Contact · click paper → Resume.
- "3 visuals" = 3 camera positions: **Desk view** (work) · **Wall view** (awards + photos) · **Corner view** (contact/chat). Smooth camera moves between them.

**Where the 3D model comes from (pick one)**
1. **Free ready-made room** from poly.pizza / sketchfab (CC0 license) → we swap textures, add your photos. Fastest.
2. **Build it in code** (boxes + planes, low-poly style). No Blender needed. Looks clean, not realistic.
3. **Make it in Blender** (free app). Best quality, biggest learning curve.
→ Start with **option 1 or 2**; upgrade to Blender later if you enjoy it.

**Things to know**
- 3D is heavy. Keep the model under ~3 MB, compress it (Draco). Show a loading bar.
- **Phones** struggle with 3D → we keep a normal 2D version as a fallback. Recruiters often open links on phones.
- Your real awards/photos = JPGs placed on the 3D frames as textures.

**Reference portfolios (open these — all checked live on 2026-09-04)**

*Rooms / desks — closest to your idea*
- https://henryheffernan.com — 3D desk, click into the computer screen. **#1 match.**
- https://jesse-zhou.com — 3D ramen-shop room, click objects → info panels.
- https://taha-shajarian.ir — stylized room, walk a character, click books / canvas / lights / cat.
- https://shahbaj-sheikh.vercel.app — 3D room, smooth camera moves, works on mobile too.
- https://jreyes-mc-portfolio.com — Minecraft-style 3D house, scroll to move.
- https://worawork.vercel.app — cozy Zelda-style house + garden.

*Worlds / islands — bigger scope, for inspiration*
- https://bruno-simon.com — drive a car around a 3D world. The famous one.
- https://jayransijn.com — explorable world with mini-activities (bike, drive).
- https://jordan-breton.com — floating sky island (FWA Site of the Day).
- https://weisdevice.xyz — small island with a robot and control panels.
- https://ameen-abdullah.dev — sakura-tree island (Awwwards winner).
- https://sebastien-lempens.com — scroll tour through 3D Paris.
- https://bilal.show — scroll-driven music-box world.
- https://samsy.ninja — cyberpunk city, WebGPU, very heavy. Pro level.

*Browse more*
- https://www.awwwards.com/websites/3d/ · https://www.awwwards.com/websites/three-js/

*Free code to learn from (room portfolios on GitHub)*
- https://github.com/AT010303/Room_Portfolio — room portfolio source.
- https://github.com/kt946/threejs-react-portfolio-tutorial-jsm — from the JavaScript Mastery YouTube "3D portfolio" tutorial.
- YouTube: search **"Andrew Woan three.js room portfolio"** — the classic free room-portfolio tutorial (based on bokoko33's room).

**Learning / assets**
- R3F docs: https://r3f.docs.pmnd.rs · Three.js examples: https://threejs.org/examples
- Free 3D assets: https://poly.pizza · https://kenney.nl · https://sketchfab.com (filter: downloadable, CC0)
- Blender (free): https://www.blender.org

---

### 2 · AI chatbot about you  🤖

**How it works (simple)**
1. We write your facts in one text: who you are, skills, projects, awards, how to contact.
2. Visitor asks: "Does Karthik know React?"
3. Our tiny server function sends **[your facts + the question]** to a free LLM.
4. LLM answers **only from your facts**. If it doesn't know → "Ask Karthik directly: email…".
5. Server function hides the API key (never put keys in the browser).

**Free options**
| Option | Type | Notes |
|--------|------|-------|
| **Groq** — https://console.groq.com | Free API, open-source models (Llama) | Very fast. **Recommended start.** |
| **Google Gemini** — https://aistudio.google.com | Free API tier | Good quality, generous limits. |
| **OpenRouter** — https://openrouter.ai | Some models marked `:free` | Easy to switch models. |
| **Hugging Face** — https://huggingface.co/inference-api | Free tier, open-source models | Slower, limits are tight. |
| **WebLLM** — https://webllm.mlc.ai | Runs 100% in visitor's browser, no server | Free forever, but downloads ~1 GB → bad for visitors. Skip. |
| **No-AI FAQ bot** | Keyword match over a Q&A list | Zero cost, zero risk, dumber. Good fallback. |

**Where the server function runs:** Vercel Serverless Functions (free with hosting). One file: `api/chat.ts`.
**Bonus:** chatbot can ask "Want Karthik to reply? Leave your email" → saved to DB → you get notified (see #4).

---

### 3 · Update projects easily  ✏️

**Today:** all content is in **one file** → `src/data.ts`. Add a project = add one block:
```ts
{ title: 'My App', blurb: 'What it does in 1-2 lines.', year: '2026', tags: ['React'], href: 'https://…' }
```
**Three ways to do it**
1. Tell Claude: *"add project: <name>, <what it does>, <link>"* → Claude edits, pushes, site updates in ~1 min. (Skill: `/add-project`)
2. Edit `src/data.ts` yourself on github.com → Commit → auto-deploys.
3. Later (optional): move projects to `content/*.md` files or a free CMS (Sanity/Contentful) if you want a form-style editor.

---

### 4 · Who visited my site?  👀

**Possible (no permission needed):** how many visits · country/city · phone or laptop · which page · how long · did they open the resume.
→ Tool: **Vercel Analytics** (built-in, free) or **Umami** (open source).

**NOT possible:** their name, email, company — browsers and privacy law (GDPR) block this. Nobody's site can do it.

**How to get it anyway (honestly):** they type it.
- Contact form → their message + email → saved to DB → **email to you** (Formspree / Web3Forms free, or Resend free tier).
- Chatbot offers "leave your email" → same flow.

---

### 5 · Database  🗄️

**Do you even need one?** Only for: contact messages, chatbot logs (what people asked), saved emails. The portfolio content itself needs no DB.

**Free options**
| Service | Type | Free tier |
|---------|------|-----------|
| **Supabase** — https://supabase.com | Postgres + auth + storage | 500 MB. **Recommended.** Pauses after 1 week idle (one click to wake). |
| Firebase Firestore — https://firebase.google.com | NoSQL | Generous free tier. |
| Neon — https://neon.tech | Postgres | Good free tier, no dashboard extras. |
| MongoDB Atlas | NoSQL | 512 MB free. |

**Tables we'd make:** `messages` (name, email, text, date) · `chat_logs` (question, answer, date) · `leads` (email, date).

---

### 6 · Interactive + stickers  ✨

- **Lottie** — free animated stickers, drop-in: https://lottiefiles.com
- **Framer Motion** — hover, drag, spring animations: https://motion.dev
- **Rive** — interactive animations (react to cursor): https://rive.app
- Custom **SVG stickers**: "Designer", "Vibe coder", "Open to work" — draggable, slightly tilted, sticker-sheet style.
- Small touches: custom cursor, click sound (optional), confetti on "Download resume".
- Rule: fun but fast. Every sticker must load in < 100 ms. Respect "reduce motion" setting.

### 10 · Walk through the room (Iron Man lab)  🕹️

**How it works**
- You control a **character** (or a first-person camera) with **W A S D + mouse**. On phone: an on-screen **joystick** or "tap where to go".
- Walls and furniture are solid → **physics** (Rapier via `@react-three/rapier`) stops you walking through them.
- Walk near the laptop / wall / hologram → a **prompt** appears ("Press E — Projects") → panel opens. Same for Resume, About, AI bot.
- **Iron Man look:** dark room, blue-cyan glowing edges, floating **hologram screens** (transparent panels with scanlines), **bloom** glow (postprocessing), soft particle dust, low hum sound (optional).
- Already done by others → https://taha-shajarian.ir (walk a character in a room) and https://jayransijn.com (full world).

**Things to know**
- This is the **hardest** 3D item. Order: static room first (click hotspots) → then add walking on top. Both can exist: "Walk" mode and "Quick tour" mode (click the 3 views).
- Recruiters are busy → always keep a **"Skip to projects"** button. Never trap them in a game.
- Phones: walking works but is fiddly → phone gets "tap to move" or the 2D fallback.

**Tools (all free):** React Three Fiber · Drei (`KeyboardControls`, `PointerLockControls`) · Rapier physics · `@react-three/postprocessing` (Bloom) · a free character from https://www.mixamo.com (Adobe, free) or a simple capsule.

---

### 11 · AI voice guide  🔊

**How it works**
1. Visitor clicks **"Enter room"** (browsers block sound until one click — no way around this).
2. A voice says: *"Hi, welcome to Karthikeyan's room. Walk to the desk to see his projects, or ask me anything."*
3. Captions show the same text (some people are muted / deaf / in an office).
4. Mute button always visible.

**Voice options**
| Option | Quality | Cost | Notes |
|--------|---------|------|-------|
| **Pre-recorded MP3** (make once with https://elevenlabs.io free tier) | ⭐⭐⭐ natural | Free | **Recommended for welcome + fixed lines.** File ships with the site, zero runtime cost. |
| **Browser voice** (Web Speech API `speechSynthesis`) | ⭐⭐ a bit robotic | Free, no server | Good for **chatbot replies** — text changes every time, so MP3 won't work. |
| Live AI voice API (ElevenLabs / OpenAI TTS) per reply | ⭐⭐⭐ | Free tier is small | Nice but can run out; use only if traffic is low. |

**Bonus:** visitor can **talk** to the bot (mic) → Web Speech API `SpeechRecognition` → free, works in Chrome/Edge (not all browsers). Text input stays as fallback.

**Rule:** voice is a garnish. Everything must work with sound off.

---


### 2D design references (checked live 7 Sep 2026)

*Clean & typographic — strong type, calm colour, one accent*
- https://brittanychiang.com — dark navy + one mint accent; the classic dev portfolio
- https://rauno.me — near-black, tiny type, obsessive detail
- https://emilkowal.ski — white, big type, animation craft
- https://paco.me — minimal, warm greys
- https://minhpham.design — designer; bold colour blocks, huge headings

*Personality & play — illustration, humour, colour*
- https://www.seanhalpin.xyz — friendly illustration, pastel, soft cards
- https://cassie.codes — purple/pink, playful SVG animation
- https://www.lynnandtonic.com — quirky, changes look every year
- https://robbowen.digital — dev with jokes and motion
- https://www.joshwcomeau.com — playful details, great blog design
- https://jhey.dev — creative dev, CSS tricks everywhere

*Motion-rich — Awwwards style, smooth page transitions*
- https://dennissnellenberg.com — dark/cream, magnetic buttons, silky scroll
- https://aristidebenoist.com — big type, scroll-driven reveals
- https://jacekjeznach.com — dev; bold gradients and motion
- https://bepatrickdavid.com — designer; editorial layout
- https://abhishekjha.me — designer; large case-study images
- https://p5aholic.me — creative dev; particles and type

*Designer + coder split (like you)*
- https://www.adhamdannaway.com — famous half-designer/half-coder hero
- https://mattfarley.ca — designer/dev with three-role intro
- https://www.craftz.dog — indie dev, warm palette, voxel scene

*Browse hundreds more*
- https://www.bestfolios.com — designer portfolios (Behance/Dribbble crowd) — closest to your world
- https://godly.website — the most polished sites on the web
- https://www.awwwards.com/websites/portfolio/ · https://www.curated.design · https://www.lapa.ninja

---

## 2b. The work grid (15 Sep 2026)

Only five projects get a tile: **Support Desk · Atom · Clickly · TNPSC · POS**, in that order, then a sixth tile sending the rest to Behance. Membership *and* order are one field — `featured: 1…5` on a project in `src/data.ts`; swap a number to reorder, delete it to drop a tile. Every other project stays in the file and its page still opens at `#/project/<slug>`, it just has no tile on the home grid.

## 2c. The case page: intro band + live copy (18 Sep 2026)

**Intro band.** Under the banner, before the overview: `Role · Built · Stack · Status`, pulled straight from `facts` on the project in `src/data.ts` — edit, reorder or add a fact there and the band follows. Every project that has facts gets one. The styling is deliberately not the usual strip penned between two rules: each fact stands behind its own vertical hairline (`.credit__rule`), the hairline grows top-down as the band arrives, and on hover it turns lime while the value slides 3px right. Component: `src/components/Credits.tsx`.

**Copy answers the cursor.** Every word of case-study copy is its own `<span class="hw">`. Third and current version: the word's own ink fills with the accent, left to right — a two-stop gradient clipped to the glyphs (`background-clip: text`), slid across on hover. `currentColor` is the second stop, so every block keeps its own resting colour without being named in the rule. Nothing moves, nothing is drawn around the word. (Version 1 lifted the word 2px with a lime underline — too busy. Version 2 washed a lime band behind it — closer, but still a box.) Wrapping lives in `src/components/Words.tsx`; it also handles `*marked*` runs. Wrapping lives in `src/components/Words.tsx`; it also handles `*marked*` runs, so the marked phrase keeps its own colour when you touch it. Applied to the overview paragraph, the six feature rows, problems/solutions, every story row and the closing block. To add it anywhere else: `<Words text={...} />` instead of `{...}`.

**Assets and weight (18 Sep 2026).** The graph paper behind the page was halved — `--grid-line` / `--grid-line-hot` in `src/styles.css`, both themes; it is meant to be felt, not read. The panel beside the overview now sits on the meadow art (`public/bento/meadow.jpg`, resized from your Downloads copy of *Cinematic Environment Concept Art (3) 1.jpg* to 1800px / 235 KB), with the dark veil over it pulled back so the sky actually shows around the screenshot. If that was the wrong picture, drop the right one in at `public/bento/meadow.jpg` and nothing else needs touching. **Check the licence before this goes public** — I do not know where that file came from.

## 2d. The banner opens as you scroll (18 Sep 2026)

The cover starts as an inset card (32px clear of the edges, 32px corners) and opens to the full width of the screen as you begin to scroll — fully open by about 40% of the banner's height. Technique borrowed from the facilio-home landing page and rebuilt here: the scroll position drives a plain 0-to-1 number (`--grow`), and CSS does the arithmetic — `top`, `left`, `right` and the corner radius are all `calc()`'d off it on `.case__hero-frame`. No transform on the picture (it would soften it) and no margin animation (it would reflow the page every frame). The resting inset is `--hero-inset` on `.case__hero`, 32px on desktop and 14px under 720px.

**Two more on the same page.** The overview title now sits in the same sticky box as its paragraph (`.primer__words`), so heading and copy hold together while the screenshot scrolls past — the hold lasts as long as the picture column is taller than the words, about 185px at 1440. And the product panel carries a caption over its foot: name, one line, a scrim under it — `showcase.title` / `showcase.note` in `src/data.ts`.

## 2e. Hover, everywhere on the case page (18 Sep 2026)

- **The pointer over live copy is the hand** (`cursor: pointer` on `.hw`) — nothing to load. Tried a few things here first: the Figma and Claude marks split across the page, a sparkle emoji, and a drawn pointer with sparks, all as real PNGs. All removed; if a custom one ever comes back, ship it as a PNG with a 2x file rather than an SVG cursor, which only Chrome handles dependably.
- **The numeral hands the row to an arrow.** In the feature list the italic number fades and steps right while a lime arrow slides in from the left. Both sit absolutely inside `.fl__mark`, so the swap cannot nudge the sentence beside them. (Tried an emoji per feature here — the arrow reads better and stays out of the way.)
- **The product panel zooms as one piece** (scale 1.022) instead of magnifying the screenshot inside its frame, which cropped the app's edges and made it look zoomed in. This one has to live in `src/components/Primer.tsx` as `whileHover`, not in CSS: that element's transform belongs to its entrance animation, and an inline transform beats any `:hover` rule the stylesheet can write. Worth remembering for any motion element — a CSS hover transform on one is silently dead.
- The sentence under each feature name is 13px, and the first row of each column has no rule above it (the title's own line is right there).

- **The hero line is short now** — "Every request now has …" with four two-word endings, so the phrase never runs at the edge of the banner. It arrives letter by letter: each character rises out of a blur 26ms behind the one before it, which reads as the phrase being written rather than swapped. Copy lives in `detail.hook` in `src/data.ts`; keep the endings short or the slot swings.

**Section spacing (18 Sep 2026).** The bands of the case page sit further apart now — `.case__body` gap, the gap inside `.primer` (overview to the feature list), `.brief`'s top margin and the `.rows` gap all went up by roughly half. Change them together or the page loses its rhythm.

## 2f. Contact is a dialog (21 Sep 2026, rebuilt the same night)

`src/components/ContactModal.tsx`. Two panels on one sheet.

**Left — the person.** The picture under a dark wash; a lime kicker and one line; then the facts:
a pulsing dot with `profile.availableNote` (only while `profile.available` is true), the live time
in Chennai (`Asia/Kolkata`, ticks every 30s), and every way to reach me as a row — email, phone
(only if `profile.phone` is set), LinkedIn, Behance. Email and phone rows have a copy button that
turns into a tick for a moment; it falls back to `execCommand` where the clipboard API is refused.

**Right — the message, in three numbered steps.** `01 What is it about` — A role · A project · Just
hello, a sliding lime pill; the choice sets the subject line and the grey prompt inside the message
box. `02 Who you are` — name and email, labels living inside the field and lifting out of the way.
`03 The message` — a plain box. Fields draw no border until you touch them. The send button is an
outline in the accent until the three are filled, then fills in — "nearly", not "off". A real-looking
email is required (`@` and a dot) — a wrong one shows a small red hint and keeps the button grey.
The grey button is not dead: pressing it focuses the first thing that is missing.

**Sending.** The button is a real `mailto:` link built from what you typed — subject
`Portfolio · <intent> — <name>`, body with your name and address signed underneath — so it opens
your own mail app and the reply lands with you. Then the dialog shows a done state with the whole
message in a box and **Copy the message**, because a desktop with no mail app configured opens
nothing and says nothing. **Edit it** brings the form back.

**Draft.** What you type is kept in `localStorage` (`contact-draft`) until you send, so closing the
dialog loses nothing; sending clears it, and closing after a send starts clean next time.

**Keyboard and focus.** Escape, the backdrop and the ✕ close it. Tab stays inside the sheet. The
first field takes focus on open; focus goes back to whatever opened it on close. The nav's
Contact button fires `open-contact`, which opens the same dialog. One column under 860px.

**Mail goes to `karthikeyan.design09@gmail.com`** — `profile.email` in `src/data.ts`.

Still a `mailto:`, not a server. Sending straight from the page needs an endpoint — Formspree or
Resend are the two-minute versions; say the word and it becomes a real POST.

Two gotchas that bit on the same night. The sliding pill is a `<span>` inside the chip `<button>`,
and a rule written as `.intent__opt > span` outranked the pill's own class and pinned it in flow at
zero width — name every child, never style a bare element under a class. And the step labels were
first called `.step`, which already exists in this sheet for the timeline and draws a rule down its
left side; they are `.cstep` now — grep the sheet before naming anything.

## 2f-2. Contact band on the home page (25 Sep 2026)

- Built after the Polser "Join the movement" screen, then made smaller: a **short banner, edge to
  edge** and the last thing on the page (about 420px tall on a laptop), your Milky Way picture as its
  background (`public/contact-sky.png`, exact file), fading in from the page at the top. **No box**
  (the glass panel went, 26 Sep): the words sit straight on the sky over a soft wash of night on
  the left, so the person with the laptop stays in view on the right; heading on one line, links
  and mail on one row. On a phone the sky shows above and the glass sits at the bottom.
- On the panel: the heading writes itself in word by word (blur → sharp), a short note, pills for
  Behance / GitHub / LinkedIn, and your mail as a light pill with a copy button (shows a tick).
- The picture drifts a little on scroll.
- Footer (name + credit) sits on the picture's bottom edge. The nav's Contact Me still opens the dialog.
- Words live in `contact` in `src/data.ts`; links come from `socials`.

## 2f-3. The landing page is the night library (25 Sep 2026)

- The mountain clips are gone (`intro.mp4`, `intro-dark.mp4`, 15 MB out of the deploy). The landing
  screen is `public/night-library.png` — your export, exact — in both themes.
- Life in it, all drawn by the page: the shelf light **breathes** (a blurred copy of the picture laid
  over itself, so only what is lit swells), **fireflies** drift in the bushes, shy of the cursor,
  and a click lets a few more loose (`Fireflies.tsx`), and the picture **leans** a few px toward the mouse.
- Words moved to the frame's left rail so they sit on the dark side, clear of the reader; the name
  is on its own line in warm cream; the tool names went up into the dark sky, top right.
- The contact band has its own picture now (the Milky Way one), so the page no longer opens and ends on the same scene.
- Tried and dropped the same day: the wide banner version at the foot of both pages.
- Next idea: the sound is still the mountain ambience (wind + birds). Crickets would suit the night.

## 2g. Where the video files should live (21 Sep 2026)

**The question: keep full quality, so a database, or what?**

**Not a database.** A DB stores video as one big blob of bytes, and to play it something has to
read the whole row out and hand it over. That breaks the one thing video needs: a **range
request** — the browser asking for "just bytes 0 to 500,000" so it can start playing after a
second instead of after the whole file. Object storage does range requests for free. A DB does
not. It also costs more per GB than storage built for files.

So: **object storage + CDN**, or a **video host**. They solve different halves.

### Two separate problems

| Problem | What causes it | Fixed by |
|---|---|---|
| Four clips cannot go in git | GitHub rejects any file over 100 MB | any storage with a URL |
| Scroll stutters | a 3692x2160 frame is decoded to fill a 1100px box — 20x the pixels, nine times over | only a smaller **rendition** |

Storage alone fixes the first and does nothing for the second. This matters: moving the files off
git and expecting smooth scroll is the mistake to avoid.

### "Without decreasing quality" — the part worth understanding

Nothing has to be thrown away. The **master stays exactly as exported**, untouched, at full
resolution. What changes is what gets *sent*: a video host keeps the original and makes copies at
360p / 720p / 1080p / 4K, then the browser picks the one that fits the box it is painting into.
That is **adaptive streaming** (HLS).

A visitor on a 1440px laptop sees the case study at ~1100px wide. Their screen physically cannot
show 2160 rows of pixels in that box. Sending 4K there is not extra quality, it is extra bytes and
extra decode — the stutter. Sending 720p to a 1100px box looks identical and decodes in a fifth of
the work. The 4K copy still exists, and a visitor on a 4K monitor gets it.

So adaptive streaming is the only option that fixes both problems **and** keeps the master intact.

### Options, best fit first

1. **Cloudflare Stream** — upload the original, it makes the renditions. Recommended.
   - Pricing is per minute, not per GB, so a 520 MB 4K file and a 50 MB one cost the same.
   - Playback: Safari plays the `.m3u8` in a plain `<video>`; Chrome and Firefox need
     [hls.js](https://github.com/video-dev/hls.js) (~30 KB). That is a real change to
     `AutoClip.tsx` — about 15 lines — not a one-line swap.
   - URL shape: `https://customer-<CODE>.cloudflarestream.com/<VIDEO_ID>/manifest/video.m3u8`
2. **Bunny Stream** — same idea, usually cheaper, same hls.js caveat.
3. **Mux** — the same again, developer-friendly, priciest of the three.
4. **Cloudflare R2** — plain storage, **no renditions**. No egress fees, which suits big files
   served often. Fixes git, not the stutter.
5. **Vercel Blob** — plain storage, least setup since the site already deploys to Vercel. Fixes
   git, not the stutter. Watch the bandwidth allowance against 520 MB of autoplaying clips.

**Git LFS is a bad fit.** Free tier is 1 GB storage and 1 GB/month bandwidth, against 520 MB of
clips. Roughly two visitors a month exhausts it, then pushes and pulls start failing.

### The free / open-source route

Cloudflare Stream is three jobs bundled together. Each has a free, open-source equivalent, so the
whole thing can be done for **$0** — the work moves to you instead of the invoice.

| What Stream does | Free equivalent | Licence |
|---|---|---|
| Makes the smaller copies | **ffmpeg** (`brew install ffmpeg`) | LGPL/GPL |
| Plays HLS in Chrome | **hls.js** | Apache 2.0 |
| Hosts the files | **R2 free tier** or **GitHub Releases** | free tier |

**R2 free tier, confirmed in their docs:** 10 GB-month storage, 1M Class A ops, 10M Class B ops,
and **egress free**. Against 520 MB of clips that is comfortable. One caveat worth knowing: the
free `r2.dev` URL is explicitly *not for production* and is rate-limited and throughput-throttled;
the documented fix is a custom domain on Cloudflare, which means owning a domain.

**GitHub Releases** is the quietly good one. Release assets allow **2 GB per file**, are served
over GitHub's CDN, and — the point — **do not count toward repository size**. So the four clips
that cannot be committed can be attached to a release **byte for byte, exactly as exported**, on
the account that already exists. No signup, no card, no re-encode.

`gh release create clips-v1 public/work/support-desk/clips/*.mp4`

Then each `clip` becomes that asset's URL. It fixes the 100 MB limit and nothing else — the
browser still receives a 4K file for an 1100px box, so the stutter stays.

**Self-hosting is not free.** PeerTube and MinIO are both genuinely open source and both need a
server to run on, which costs more per month than Stream does.

**On re-encoding, since the rule here has been to ship the exports untouched:** making the smaller
copies does not touch the original. The export stays as the top rung of the ladder and is what a
4K screen receives; the smaller rungs are *added* beside it for screens that cannot show 4K
anyway. That is precisely what Stream does internally — ffmpeg just does it on this laptop.

### What it takes in the code

For plain storage (options 4–5) the change is genuinely one line per clip in `src/data.ts` —
`clip` goes straight into `<video src>`, so a full URL works with no code change at all:

```ts
clip: 'https://<bucket>.example.com/thread.mp4',
```

For a video host (1–3) it is that plus hls.js in `AutoClip.tsx`.

**Not started — every one of these needs an account and a token I do not have.** Nothing has been
uploaded anywhere. Pick a host and I will wire it up.

### Already shipped, no host needed

`src/scrollIdle.ts` + `AutoClip.tsx` (commit `c86322f`): one shared scroll listener, and a clip
plays only while properly on screen **and** the page is at rest. The visibility threshold went
0.15 -> 0.55 so a clip no longer starts while barely in view, and nothing plays on mount, which
had been starting all nine decoding at page load. No video file was touched. This is the cheap
80% — it stops decode competing with scrolling, but a 4K frame is still a 4K frame once it plays.

## 2h. Covers, and the release the clips live on (21–22 Sep 2026)

### The covers are ours now

The bento tiles were carrying painted illustrations **copied out of the labs-client repo** as
placeholders (the commit that added them says so in as many words). That is an employer's artwork
on a personal job-hunting site, so they are gone.

Eighteen replacements are drawn in **`scripts/make-covers.mjs`** — one per project, each an
abstraction of the thing itself rather than a picture of it. Re-run any time:

```
node scripts/make-covers.mjs
```

**56 KB in total, against 2.5 MB of jpg**, and vector, so they stay sharp at any size.

The constraint that shapes them: the grid runs from about 4:1 to nearly square, `object-fit: cover`
crops whatever does not fit, and `.box__veil` then darkens the bottom so a title can sit on it.
Intersect those and **y 325–600** is the only band reliably visible *and* reliably light. So the
shell scales every motif into that band (`SAFE`), with a per-cover `zoom` for sparse motifs that
went thin when shrunk. The contact banner is not a tile — it is a **tall** panel, cropped at the
sides — so that one is built around a single centre and survives a crop from any direction.

**Reverted 24 Sep 2026.** You asked for the original pictures back, so all 22 jpgs are restored
and every tile points at them again. The drawn covers and the generator stay in the tree unused
(92 KB), so switching any single tile back is one line in `src/data.ts` rather than a redraw.

The reason for the swap has not changed and is the thing to fix properly: those files came out of
the labs-client repo as placeholders, this repository is public, and they are also in git history
either way. The real answer is your own screenshots on each tile — at which point neither the
borrowed pictures nor the drawn ones are needed.

### The clips: originals on a release

`clip` now points at `https://github.com/Karthikeyan794/portfolio/releases/download/clips-v1/…`
(the `HD` constant in `src/data.ts`) for the five recordings that cannot be committed.

**Update, 24 Sep 2026:** `gh` is installed and logged in here now (account Karthikeyan794, `repo`
scope), so the release was created from the terminal and **`views.mp4` is up** — 236,273,045 bytes,
byte for byte the export, range requests answered. The other five are one command away:
`gh release upload clips-v1 ~/Desktop/portfolio-clips-to-upload/{home,thread,merge,reply,ai-suggestions}.mp4`.
The Teams bot flow is back as the last row of *How it works* (25 Sep 2026), written from the
recording of Milo. The recording shows real customer and colleague names; you uploaded it to the
release yourself under its raw filename, and the row points at that name. The two recordings that
sat on the release unwired are on the page now: the Teams notification on *Assigning a ticket*, and
*Who gets in, and what they may do* as a new row before it. Like Milo, the assignment recording was
made against the real desk and shows colleagues’ names and work emails; you uploaded it yourself.

**Checked 25 Sep 2026, every clip on the page:** the overview and all eleven flow recordings load
over the real network and play, each one the export byte for byte (sizes matched against the
Desktop originals). The four smaller copies still in `/public` (home, merge, reply, thread —
214 MB) are the `clipFallback` for the release-hosted ones, so they stay.
The manual steps below are kept in case that login ever goes:

1. Open **github.com/Karthikeyan794/portfolio/releases/new**
2. Tag: **`clips-v1`** (type it; it will offer to create it)
3. Drag in everything from **`~/Desktop/portfolio-clips-to-upload/`** — already renamed URL-safe
4. **Publish release** — not *Save draft*: a draft's assets need a login to fetch

| file | size | what it is |
|---|---|---|
| `home.mp4` | 268 MB | the dashboard that reads zero |
| `thread.mp4` | 177 MB | the thread, its recipients, its attachments |
| `merge.mp4` | 170 MB | merging duplicates, marking spam |
| `reply.mp4` | 159 MB | the reply, start to finish |
| `ai-suggestions.mp4` | 146 MB | the AI suggestion and its three states |

Verified about release assets: they answer **byte-range requests** (`206`), so a browser starts
playing before the file finishes, and they allow 2 GB per file and do not count toward repository
size. Content type is recorded at upload; a browser upload of an `.mp4` sends `video/mp4`.

**It took over with no code change**, exactly as intended. The `clipFallback` on each slice stays
anyway: it costs nothing while the release is up, and means a deleted asset or a renamed tag
degrades to the smaller copy rather than an empty frame.

One wrinkle if it ever needs repeating: re-submitting the edit form after the files have attached
fails with *release assets name has already been taken*. That error is harmless — the assets are
already saved. Close the form rather than retrying.

## 2h-2. The mobile row (25 Sep 2026)

- Row 14 under *How it works*: **Support Desk on Mobile**, `clips/mobile.mp4` — your export, exact
  (12 MB, so it lives in the repo, not on the release). It shows the desk at phone width inside a
  phone mockup on the meadow, so it sits in the media column like every other recording.
- No new code: it is one more slice in `src/data.ts`, rendered by the same `ClipFigure`.

## 2i. The demo, embedded (25 Sep 2026)

The case study ends with the desk itself, running in a drawn window — the same build the team
uses, on generated data. Component: `src/components/DemoFrame.tsx`; the slice carries
`embed: { src, pages, art }` and the row renders it under the words across the full width.

**Where the app lives.** `public/demo/support-desk/` — a copy of the static build from
`~/Desktop/support-desk-demo/demo/` (6 MB, 19 files). Copied without the stray pictures at the
package root that nothing referenced, without the five sub-folder `index.html` copies (the app
routes by hash, so they were only ever for deep links), and without `sw.js` — the bundle
registers its worker at an absolute `/sw.js`, which at this address can never resolve; the
call is caught and nothing runs, so the file was dead. To update the demo, re-copy the build
the same way. The data is baked into the bundle: fictional companies and people on
`demodesk.io`, the AI readings and Teams cards written in; the only outside traffic is Google
Fonts and customer-logo lookups.

**It follows the viewport (25 Sep 2026).** The window's height is a share of the screen
(`clamp(680px, 92vh, 1040px)`, less on a phone) — the height of a real browser window on a
laptop, so the desk has the room it was built for. It may run past the fold; the page scrolls,
and *Open in full screen* is there for anyone who wants the whole screen. (A first cut at 74vh
made it fit entirely on screen and looked shrunken; you asked for the real height back.) The app is built for a desktop, so below 1100px of room it is not squeezed: the iframe is
drawn at 1100px and scaled down to fit (`transform: scale`, measured with a `ResizeObserver` in
`DemoFrame.tsx`), so a phone sees the desk whole — small, but whole — and *Open in full screen*
is right there. A laptop's content column is about 1100px, so it gets the app 1:1.

**The header leaves while the demo is on screen (25 Sep 2026).** The frame watches itself with
an `IntersectionObserver` and fires a `demo-inview` event; the case page's fixed header listens
and takes `.case__nav--away` (slid up, faded, no pointer events) so it never sits over the top of
the app. Scroll back up and it returns. The wallpaper behind the window is your meadow and paper
plane, `public/work/support-desk/demo-bg.jpg` (2000×1427, 409 KB, as sent), shown sharp under a
light tint — the `art` field on the slice's `embed`.

**The tabs are roles, not pages (25 Sep 2026).** Admin · View only access · Reply access. Each
opens the same desk signed in as that kind of user, so the two access flows can be tried rather
than read about: as *View only*, Reply becomes a "you have view access" prompt that opens the
*You do not have edit access — Request access* dialog; as *Reply access* (the support role) you
can reply, assign and edit but not manage access; *Admin* has everything. It works because of
one patch on our copy of the demo bundle — the build hard-codes the signed-in role to admin at
start-up, and the two places it does that now read `localStorage.getItem("sd.demoRole") ||
"admin"` (the clips README has the exact strings, for when the build is re-copied). A tab writes
that key into the iframe's storage (same origin) and reloads it; the address line says who you
are signed in as. Home / Tickets / Customers are gone from the strip; the app's own nav does that.

**How the window behaves.** Inert until you press *Click to interact* — the iframe takes no
pointer events, so scrolling the page past it never gets caught inside the app. Move the pointer
out of the window and it goes quiet again. The tab strip (Home · Tickets · Customers) drives the
app's own router through its hash, same origin, no reload; the address line follows; *Open in
full screen* opens the current page in a new tab. The header's *Try the demo* points at the
same place. 16:10 on desktop, 4:5 on a phone, where the tabs hide.

**The gotcha.** In dev, a browser asking for the folder (`/demo/support-desk/`) gets the
*portfolio* — Vite's single-page fallback claims every HTML request that is not a file, and
the public folder is only consulted after. A curl gets the demo because it does not ask for
HTML, which made this confusing. Every address therefore points at the file itself,
`/demo/support-desk/index.html#/…`, which works the same way in dev and on Vercel.

Verified 25 Sep 2026 by driving it headlessly: the queue loads 200 tickets, a ticket opens with
Reply, Assignee and AI summary, the composer opens on the template greeting, Customers lists
seven accounts, Home shows the welcome and the counts — no dialogs, no errors.

## 2i. The end of each case study is a bento (25 Sep 2026)

`src/components/CaseEnd.tsx`, on every project page. Modelled on the bento reference you sent: a
28px heading, then five tiles, read in this order — left to right, top to bottom, and the same
order in the source, so tab and screen reader follow the eye.

| Tile | What it is |
|---|---|
| **Up next** (tall picture) | the next project on the home grid after this one |
| **Keep going** (picture) | the project after that |
| **12+** | how many more there are — takes you back to all work |
| **Your take** | Liked it / Not for me, and one field: *Share your thoughts about this project* |
| **Contact** | your email (click copies it), arrow opens the contact dialog |

There is no separate Get in touch button — the Contact tile is the way in. The grid is about 540px
tall at desktop width.

The two projects wrap round the home grid, so each case study hands on to a different pair and
reading them in order visits them all. The project page is keyed by slug now, so moving to the next
one from its footer starts fresh — no answer or scroll carries across.

### Your take → your inbox

**Nothing is required.** A thumbs on its own, a line on its own, or both. Send is one email; a thumbs
click alone sends nothing, so toggling your mind doesn't fill the inbox.

It goes to **karthikeyan.design09@gmail.com** through **FormSubmit** — no account, no key; the address
is the endpoint (`feedback` at the top of `src/data.ts`). Each email arrives as a table with the
project, the reaction and the thought, subject `Portfolio · Support Desk — liked it`.

**One thing only you can do: activate it.** The very first submission doesn't arrive — FormSubmit
sends an *Activate Form* email to that address instead. Send one test from the page, open that
email, click the button. Until then a visitor sees *"That did not go through — Email it instead"*, so
nothing is lost in the meantime. If the site later moves to a new domain, FormSubmit may ask once
more for that domain.

Private by design: nothing anyone sends is shown on the site. A hidden field catches bots — they get
a success screen and nothing is sent.

Verified with the network stubbed: reaction-only and thought-only sends, the 200-with-`success:
"false"` answer FormSubmit gives before activation, and the bot trap.

## 3. Checklist — what's done

### Phase 0 · Setup
- [x] Project folder created (`~/Documents/portfolio`)
- [x] React + Vite + TypeScript scaffold
- [x] GitHub repo: https://github.com/Karthikeyan794/portfolio
- [x] Research + this plan file
- [x] `CLAUDE.md` (short answers rule) + `/add-project` skill

### Phase 1 · Content (you give, Claude places)
- [x] **Colour theme** — grey canvas `#eceef0` (light) / near-black `#0a0b0c` (dark) · deep forest green `#1e3a34` primary, used only on primary things · lime `#a6e85b` accent
- [ ] Your real bio (3–4 lines), role, location
- [ ] **Resume PDF**
- [x] **Behance projects** — all 12 pulled from behance.net/karthikbabu13 via its RSS feed; covers downloaded to `public/work/` (2.4 MB total, no hotlinking). Blurbs are my first drafts — rewrite in your own words in `src/data.ts`
- [ ] **Support Desk + Atom**: demo URLs (`demo.href` in `src/data.ts`), walkthrough videos (`video` on the Walkthrough slice — MP4 in `public/` or a YouTube/Loom link), and 4–6 real screenshots to replace the placeholder banners
- [x] **One thumbnail set** — every project now uses a `/bento/*.jpg` image from the labs-client repo so the grid reads as one theme (Behance covers retired). Swap any file for your own generated art later, same path
- [x] **Graph-paper canvas** — faint grid over the grey/black background whose lines brighten in a soft circle that follows the cursor
- [ ] **Your own banner images** → `public/bento/*.jpg` are back at your request, and they are still the labs-client placeholders on a public repo. Replace with your own screenshots before this goes on a CV. Drawn stand-ins are ready in `scripts/make-covers.mjs` if you want any tile swapped back — one line each in `src/data.ts`.
- [ ] Awards (photos + one line each)
- [ ] Profile photo
- [ ] Social links (GitHub, LinkedIn, Behance)

### Phase 2 · 2D site — the focus now
- [x] Sticker Rubik's-cube intro loader
- [x] Roboto + Playfair Display wired in
- [x] Apply your colour theme (tokens in `src/styles.css`; cube loader recoloured too)
- [x] **Opening hero** in the "UGH" reference layout: picture full-screen with slow life in it (clouds drifting, mist over the valley, breeze in the grass, gentle Ken Burns) → headline bottom-left with the serif punch word *Karthikeyan.* → copy → email → "Say Hello." pill → tool wordmarks bottom-right → hairline frame → nav slides in (transparent over the picture, solid cream after you scroll). "Play intro voice" reads the intro (browser voice; browsers need a click before sound)
- [x] **Background clip** in place — `public/intro.mp4` (your "clouds drifting over mountain lake", 1920×1080, 10 s, 7.4 MB, loops) with `public/intro.jpg` underneath while it loads. Set `intro.image = '/intro.jpg'` in `src/data.ts` to go back to the still + CSS motion
- [x] **Nature sound** on the landing page — wind, distant birds, rustling leaves, synthesised in the browser (no audio file). Starts on the visitor's first click/tap/key (browser rule), speaker toggle in the nav, remembers "off", ducks when you scroll past the hero, pauses in hidden tabs
- [x] ~~**Snowfall** over the landing screen~~ → fireflies since 25 Sep (snow still drifts in About). Was: — smooth canvas flakes (drawn icy crystal sprite at `public/snowflake.svg`; drop your own PNG there to swap), depth-based speed, sway, spin; sleeps off-screen and in hidden tabs; off for reduced-motion users
- [x] **Dark theme** — sun/moon toggle in the nav; the hero crossfades to your night clip (`public/intro-dark.mp4`, fetched only when first needed), page colours fade to the dark green set
- [ ] Better voice: record the intro once with ElevenLabs (free tier) → MP3 (#11)
- [ ] Hero photo + resume button (now inside the intro)
- [x] **Support Desk case study page** — research first (mailbox audit → column audit → what access I got → the two-permission model), then the build one piece at a time, then what broke and where it landed. Nine drawn diagrams in `src/components/Diagrams.tsx` (a slice picks one with `diagram: 'system' | 'audit' | 'access' | 'permissions' | 'reply' | 'gate' | 'derive' | 'teams' | 'rules'`). A slice can also carry `pair` (problem → what I did) or `stats` (outcome numbers). Source material lives outside the repo: `~/Desktop/support-desk-demo/CASE-STUDY.md`, `HELP-MAILBOX-ACCESS-FLOW.md`, and `~/Downloads/support-desk-teams-bot/README.md`. Rebuilt again as a **story** on 14 Sep 2026 in the order the work happened: the problem → the support meeting and its six asks (they were on a Freshdesk basic plan) → built-vs-bought → the Microsoft access collected up front and what it could actually do → the flow drawn before any screen → Figma → then every flow one at a time (access, assign + Teams, reply with template and AI, draft-then-send, saved views, customer, SLA clocks, dashboards, the intake check, the Teams bot) → what broke → where it landed. 19 diagrams. Grounded in the app source at `~/Desktop/support-desk-demo/src-app` (scopes in `src/lib/config.js`, SLA reasoning in `lib/sla.js`, AI contract in `lib/ai.js`, Teams cards in `lib/teams.js`). **25 Sep 2026: the drawn diagrams are removed** — every one of them, along
  with `src/components/Diagrams.tsx`, the `diagram` field on a slice, the branch that rendered it and its
  styles. The case study is words and recordings now; the `--dia-*` colour tokens stay because the pair
  panels use them.

  The opening spread: a plain-English primer (`src/components/Primer.tsx`, data in `detail.primer`) then **Problems / Solutions** side by side (`src/components/Brief.tsx`, data in `detail.brief`). A section pill (`src/components/CaseTabs.tsx`) sits top-right of the overview and docks into the top bar as you scroll.

  Removed on 15 Sep 2026 as surplus: the Goals cards, the User flow map and the Design phases spine (`src/components/Phases.tsx`, data in `detail.phases`): numbered nodes down the middle, cards alternating either side, a duration pill and three checklist items each — the layout from the Pinterest references. Folds to one column under 880px.

  Still missing, and only you can supply them:
  - [ ] the **Figma rough layout** as an image, for the "Rough in Figma" slice
  - [x] the **overview walkthrough** — done 20 Sep 2026 from your Desktop recording:
        `public/work/support-desk/clips/overview.mp4` (your own 1748x1080 export, 5.3 MB, copied in untouched) plays in the panel beside the Overview
  - [ ] **one clip per flow** — see `public/work/support-desk/clips/README.md` for the shot list and how to wire each one
  - [ ] confirm the **Freshdesk basic plan** limits the team actually hit, so the competitor slice can be specific rather than general
- [x] **Two bento blocks, split by category** — *Product & UI/UX* (7 boxes) and *Craft & explorations* (8 boxes, including the new **Drawings & Art** project), each its own rectangle with a labelled rule separating them, on a much wider track (up to 1720 px / 95vw) so the grid uses the screen instead of leaving big side margins. Each block is a 4-col x 4-row rectangle with mixed spans, so sizes are deliberately unequal: big 2x2 blocks, wide 2x1 strips, 1x2 portraits and 1x1 squares. No divider line between groups. Each block is — each block is one fixed rectangle subdivided by named grid areas into interlocking boxes of different sizes (tall left, wide centre, slim right, mirrored in the next block). Art fills each box, label sits over it, boxes scale-and-fade in with a stagger; hover **grows the hovered box inside the rectangle and its neighbours give up the room** (the block's grid tracks resize, so nothing spills past the edges and the outer size never changes), zooms the art, lifts the label, reveals the CTA, dims the other boxes and sweeps a sheen — matching the reference reel
- [x] **Case-study pages** at `#/project/<slug>` — **every** project opens in-site now (nothing redirects to Behance; the Behance link sits in the page header). Banner parallaxing under the title, facts bar, intro, then rows with the **explanation sticky on the left and the screens/video on the right**; pointing at a screen slides its note up over it. Scroll-progress bar, demo button, Esc to go back
- [x] Mini projects grid from Behance (cover, title, one line, link, Practice badge)
- [ ] Confirm which projects are course/practice vs real work (`kind: 'practice'` in `src/data.ts`)
- [ ] **Your drawings** → drop files in `public/art/` and list them in the `drawings` project's slices in `src/data.ts` (placeholder art is in place)
- [ ] About + skills + experience with real content
- [ ] Contact form → email to you (#4)
- [ ] Mobile pass
- [ ] Deploy to Vercel → live URL

### Done so far (2D)
- [x] Hero, About, Projects, Awards, Experience, Contact (placeholder text)
- [x] Motion from your first Pinterest reference: page tilts into view, stickers drift + follow the mouse + draggable, sections rise on scroll (#6)
- [x] Rubik's-cube loader (~5.8 s, plays once): pieces fly in and combine → a thick wavy ribbon with text sweeps behind then in front of the cube → the hit spins the cube while its layers twist → lands solved and stops. Each face is one big die-cut design sticker — SLEEP·DESIGN·REPEAT, smiley GET THINGS DONE, BUILD DIFFERENT, ★ VIBE CODING ★, SHIP IT!, retro LOADING… computer
- [x] Contact form → opens email app (direct sending in Phase 5) (#4)
- [ ] Analytics (#4)
- [ ] **Deploy to Vercel → live URL**

### Phase 3 · 3D room (#1) — PARKED (first version exists, hidden for now)
- [x] Room built in code + free Kenney Furniture Kit models (CC0), recoloured to the lab palette
- [x] Desk view + laptop → Projects · tablet → Contact · paper → Résumé · hologram → About
- [x] Wall view + frames → Awards & photos (placeholder images)
- [x] Corner view → AI core → Lab assistant
- [x] Loading + "Enter the lab" screen (will also unlock sound), phone fallback = 2D page
- [ ] Real photos on the wall frames, real project screenshots on screens
- [ ] Polish pass: more props, better hologram, idle camera drift, sound
- [ ] Walk mode: WASD + mouse, joystick on phone (#10)
- [ ] Physics walls (Rapier) + "Press E" prompts near objects (#10)
- [ ] Iron Man look: hologram panels, bloom glow (#10)
- [ ] "Skip to projects" button always visible

### Phase 4 · AI chatbot (#2)
- [ ] Write "facts about me" text
- [ ] Groq/Gemini key → Vercel env var
- [ ] `api/chat.ts` function
- [x] Chat UI in the room (corner view) — keyword bot for now, answers from `src/data.ts`
- [ ] "Leave your email" flow
- [ ] Welcome voice MP3 + captions + mute (#11)
- [ ] Bot replies read aloud with browser voice (#11)
- [ ] Mic input (optional) (#11)

### Phase 5 · Database (#5)
- [ ] Supabase project
- [ ] Tables: messages, chat_logs, leads
- [ ] Connect form + chatbot

### Phase 6 · Launch
- [ ] Custom domain (optional, ~₹1000/yr)
- [ ] SEO: title, description, preview image
- [ ] Share link on LinkedIn / resume

---

## 4. Order (updated)
We went 3D-first after seeing the 2D draft. The 2D page stays as the **phone version** and fallback — same content, same `src/data.ts`.

**Credits:** 3D furniture from the [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) (CC0). Licence copy in `public/models/`.

## 5. Ideas parking lot (add anything)
- _empty — write new ideas here, we research before building_
