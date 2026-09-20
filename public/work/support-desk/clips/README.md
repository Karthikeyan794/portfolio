# Clips for the Support Desk case study

**In place now:** `overview.mp4` — the walkthrough that plays in the panel beside the Overview
(home, the queue, a thread, a reply going out, the detail panel). It is **your own export, copied
byte for byte** from `~/Desktop/Support desk videos/overview .mp4`: 1748x1080, 5.3 MB, untouched.
Nothing is re-encoded, resized or re-compressed on the way in, and nothing is on build either —
files in `public/` are served exactly as they sit here.

The still at `../2-queue.jpg` is the video's poster, so the panel is never empty while it loads.

**Replacing it:** drop a new file at this path with this name. Keep MP4 (H.264) — it plays
everywhere including Safari and iPhone, which WebM does not reliably do, and it is the format the
`<video>` in `src/components/Primer.tsx` points at through `showcase.clip` in `src/data.ts`.

**Never ship the GIF.** The same recording as a GIF is 50 MB against 5.3 MB here, is capped at 256
colours, and cannot be paused when it scrolls out of view.

## The rest of the shot list

One clip per flow still to come — the flows are numbered in the case study, and each slice in
`src/data.ts` takes a `clip` field the same way the showcase does.
