# Portfolio

Personal portfolio — React 18 + Vite + TypeScript, no UI framework, ~zero runtime deps.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

## Editing content

Everything textual lives in [`src/data.ts`](src/data.ts): name, tagline, socials,
projects, experience, skills. Change it there; the components just render it.

- Put a résumé at `public/resume.pdf` and set `profile.resumeUrl = '/resume.pdf'`.
- Give a project an `href` to make the whole card a link.
- Mark a project `featured: true` to make it span the full row.

Theme follows the OS by default; the toggle in the nav overrides it and remembers the choice.

## Hosting

The build is plain static files (`dist/`), so anything that serves HTML works.
See the notes in the repo conversation or pick one:

| Host | Setup |
| --- | --- |
| Vercel / Netlify / Cloudflare Pages | Connect the Git repo → build `npm run build`, output `dist` |
| GitHub Pages | Set `base: '/<repo-name>/'` in `vite.config.ts`, deploy `dist/` via Actions |
| S3 + CloudFront | `npm run build` then sync `dist/` to the bucket |
