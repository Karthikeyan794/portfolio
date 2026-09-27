# Portfolio

Karthikeyan B's portfolio: product design and front-end work, with two case
studies you can watch and click through (Support Desk and Atom).

React 19 · Vite · TypeScript · plain CSS (tokens in `src/styles.css`) · motion.
A 3D lab (React Three Fiber, `src/three`) is parked behind `LAB_ENABLED` in
`src/App.tsx`; it loads only if switched on.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

## Where things live

- **All text and projects:** [`src/data.ts`](src/data.ts). Components only render it.
- **Case-study recordings:** `public/work/<project>/clips/`. Anything over 100 MB
  (GitHub's limit) is on the release `clips-v1` instead; see
  `public/work/support-desk/clips/README.md`.
- **The two product demos:** `public/demo/support-desk/` and `public/demo/atom/`,
  each a built copy of its own project, on made-up data.
- **Résumé:** `public/Karthikeyan_B_CV.pdf` (`profile.resumeUrl`).
- **Plan and checklist:** [`ROADMAP.md`](ROADMAP.md).
- `assets-src/` (git-ignored) holds source files kept out of the repo.

## Deploying (Vercel)

The build is plain static files, and routes are hashes (`#/project/atom`), so
no server config is needed.

1. On vercel.com, **Add New → Project**, import `Karthikeyan794/portfolio`.
2. Framework **Vite** (detected): build `npm run build`, output `dist`.
3. **Deploy.** After that, every push to `main` deploys by itself.

Watch **usage** in the Vercel dashboard: the recordings are large, and the free
plan includes 100 GB of transfer a month.

## Credits

- 3D furniture (parked lab): [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit), CC0, in `public/models/`.
