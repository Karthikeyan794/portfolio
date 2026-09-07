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

## 3. Checklist — what's done

### Phase 0 · Setup
- [x] Project folder created (`~/Documents/portfolio`)
- [x] React + Vite + TypeScript scaffold
- [x] GitHub repo: https://github.com/Karthikeyan794/portfolio
- [x] Research + this plan file
- [x] `CLAUDE.md` (short answers rule) + `/add-project` skill

### Phase 1 · Content (you give, Claude places)
- [ ] **Colour theme** — 3–5 colours (background, text, primary, accent) as hex codes or a screenshot
- [ ] Your real bio (3–4 lines), role, location
- [ ] **Resume PDF**
- [ ] **Behance / Figma links** for the mini projects (+ 1 cover image each, PNG/JPG)
- [ ] **Support Desk** (main project): what it is, your role, tools, 4–6 screenshots, demo video(s) as MP4 or YouTube/Loom link
- [ ] Awards (photos + one line each)
- [ ] Profile photo
- [ ] Social links (GitHub, LinkedIn, Behance)

### Phase 2 · 2D site — the focus now
- [x] Sticker Rubik's-cube intro loader
- [x] Roboto + Playfair Display wired in
- [ ] Apply your colour theme
- [ ] Hero redesign with your photo + resume button
- [ ] **Support Desk case study page** (problem → process → screens → demo videos → result)
- [ ] Mini projects grid from Behance/Figma (cover, title, one line, link)
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
