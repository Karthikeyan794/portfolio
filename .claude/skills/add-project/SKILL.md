---
name: add-project
description: Add or update a project on the portfolio site and push it live. Use when the user says "add project", "update project", "new project", or shares a project they finished.
---

# Add / update a project

1. Collect (ask only for what's missing, one short question):
   - **title** · **blurb** (1–2 lines, what it does + your role) · **year** · **tags** (3–5) · **href** (live link or repo, optional) · **featured?** (full-width card)
2. Open `src/data.ts` → `projects` array.
   - New project → add to the **top** of the array (newest first).
   - Update → edit the matching `title`.
3. Run `npm run typecheck`.
4. Commit: `Add project: <title>` (or `Update project: <title>`). Push to `main`.
5. In `ROADMAP.md`, tick any related checkbox.
6. Reply in ≤ 3 lines: what changed + the GitHub commit link + "live in ~1 min" (once Vercel is connected).
