# Portfolio — Plan & Checklist

> Read this file when you forget what we decided. We tick the boxes as things get done.
> Site goal: help Karthikeyan apply for jobs. Live URL: _(coming — Vercel)_

---

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

---

## 3. Checklist — what's done

### Phase 0 · Setup
- [x] Project folder created (`~/Documents/portfolio`)
- [x] React + Vite + TypeScript scaffold
- [x] GitHub repo: https://github.com/Karthikeyan794/portfolio
- [x] Research + this plan file
- [x] `CLAUDE.md` (short answers rule) + `/add-project` skill

### Phase 1 · Content (you give, Claude places)
- [ ] Your real bio (3–4 lines), role, location
- [ ] Projects list (name, 1–2 lines, link, screenshot)
- [ ] Awards (photos + one line each)
- [ ] Resume PDF
- [ ] Photos for the room walls
- [ ] Social links (GitHub, LinkedIn)

### Phase 2 · 2D site (mobile + fallback) — ships first
- [ ] Hero, About, Projects, Experience, Contact
- [ ] Stickers + animations (#6)
- [ ] Contact form → email to you (#4)
- [ ] Analytics (#4)
- [ ] **Deploy to Vercel → live URL**

### Phase 3 · 3D room (#1)
- [ ] Pick room model (free asset / code-built)
- [ ] Desk view + laptop → Projects
- [ ] Wall view + frames → Awards, photos
- [ ] Corner view → Contact, Resume
- [ ] Loading screen, Draco compression, phone fallback

### Phase 4 · AI chatbot (#2)
- [ ] Write "facts about me" text
- [ ] Groq/Gemini key → Vercel env var
- [ ] `api/chat.ts` function
- [ ] Chat UI in the room (corner view)
- [ ] "Leave your email" flow

### Phase 5 · Database (#5)
- [ ] Supabase project
- [ ] Tables: messages, chat_logs, leads
- [ ] Connect form + chatbot

### Phase 6 · Launch
- [ ] Custom domain (optional, ~₹1000/yr)
- [ ] SEO: title, description, preview image
- [ ] Share link on LinkedIn / resume

---

## 4. Why this order?
2D first → you have a **live, shareable link in days**, works on phones. 3D + AI stack on top. If 3D takes long, the site is still useful for job applications.

## 5. Ideas parking lot (add anything)
- _empty — write new ideas here, we research before building_
