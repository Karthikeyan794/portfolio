# Portfolio — working rules

## How to talk to me
- I'm a fresher. **Keep answers short.** Bullets over paragraphs.
- Simple English. If you must use a technical word, explain it in 5 words.
- One small example beats a long explanation.
- Long details go into `ROADMAP.md`, not into chat. Point me to the section.

## Project facts
- Personal project → GitHub `Karthikeyan794/portfolio`. Never Facilio infra.
- All site text/projects live in `src/data.ts`. Components only render it.
- Plan + checklist: `ROADMAP.md`. **Tick the box when a task is done.** Add new ideas to "Ideas parking lot" and research before building.
- Commit identity is set per-repo (personal GitHub no-reply). Don't change it.
- After finishing a task: typecheck (`npm run typecheck`), commit, push. Vercel auto-deploys.

## Stack
React 18 · Vite 5 · TypeScript · plain CSS (tokens in `src/styles.css`). Add libraries only when a ROADMAP item needs them.

## Commands
- `npm run dev` — local preview at http://localhost:5173
- `npm run build` — production files in `dist/`
- `npm run typecheck`
