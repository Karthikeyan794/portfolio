# Clips for the Support Desk case study

**In place now:** `overview.mp4` — the walkthrough that plays in the panel beside the Overview.
It is **24.8 MB**, and its index (`moov`) sits at the end of the file, which means a visitor's
browser downloads the whole thing before it can show a single frame. It autoplays, so it downloads
whether they watch or not. See **Export settings** below — the target is 3–5 MB.

The still at `../2-queue.jpg` is the video's poster, so the panel is never empty while it loads.

**Replacing it:** drop a new file at this path with this name. Keep MP4 (H.264) — it plays
everywhere including Safari and iPhone, which WebM does not reliably do, and it is the format the
`<video>` in `src/components/Primer.tsx` points at through `showcase.clip` in `src/data.ts`.

**Never ship the GIF.** The same recording as a GIF is 50 MB, is capped at 256 colours, and cannot
be paused when it scrolls out of view.

---

## Recording the walkthrough — the flow to follow

Run the demo first: `~/Desktop/support-desk-demo/start-demo.command` (it serves on :8899). Record
**the demo, never the real desk** — the demo runs on generated data (`support@demodesk.io`,
`redgateretail.com`, fictional people) and no real customer or colleague appears in it.

### Before you press record

- Browser at **1440 × 900**, zoom at 100%, full screen — no bookmarks bar, no other tabs
- Quit anything that shows a notification banner (Teams, Mail, Slack)
- Dark mode on, to match the page the clip plays in
- Have the queue already loaded before you start, so shot 1 opens on something

### The shots, in order

Around **45–60 seconds total**. Move slowly — a cursor that darts is unreadable at this size.
Pause ~1s on each screen before clicking, so a viewer's eye lands before the screen changes.

| # | Shot | What to do | ~sec |
|---|------|-----------|------|
| 1 | **The queue** | Open on the ticket list. Let it sit a beat, then scroll a few rows | 6 |
| 2 | **Filter it** | Open a filter, pick one status, let the list narrow | 6 |
| 3 | **Open a ticket** | Click a row. The thread opens beside the list | 5 |
| 4 | **The thread** | Scroll the conversation so it reads as a real exchange | 6 |
| 5 | **Assign it** | Set an owner from the detail panel. Let the row update | 6 |
| 6 | **Reply** | Open the composer, show the draft already written, edit a word | 8 |
| 7 | **The clock** | Point at the response SLA — the first-response and resolution numbers | 5 |
| 8 | **Customer view** | Switch to Customers, open one company, show its history | 8 |
| 9 | **Dashboard** | End on the dashboard, so the last frame is the whole desk | 6 |

Shot 9 is the last frame people see when the loop restarts, so leave it clean and still.

### What NOT to film

- The mailbox-access gate (it is a permissions screen, and it is dull on film)
- Anything with a real address in it — check the top bar before you start
- Your own cursor hovering over a menu you then close; cut it, or do not do it

### Export settings

Target **3–5 MB**. The clip is muted and autoplaying, so nobody hears audio and nobody needs 4K.

- **1280 × 800** is plenty — it renders at ~720px wide on the page
- **H.264**, 30fps, no audio track
- **Faststart on** (index at the front, so it plays before it finishes downloading)
- Under 60s

With ffmpeg (`brew install ffmpeg`), that is one command:

```
ffmpeg -i input.mov -vf scale=1280:-2 -c:v libx264 -crf 26 -preset slow -an -movflags +faststart overview.mp4
```

## Also in place

`queue.mp4` — the shared queue and the reload beside the list: press it and the desk reads the
mailbox again, so whatever arrived since comes in as a new ticket at the top. This is `que 2`,
**your export copied byte for byte**: 3692x2160, 86 MB, untouched.

`filter.mp4` — the thirteen filters over the queue: a status applied, then a customer, the two
stacking to narrow the list. Also **byte for byte**: 3604x2160, 59 MB.

These are deliberately uncompressed — the originals go up as they are. Worth knowing what that
costs, so it is a choice rather than a surprise:

- **86 MB is close to GitHub's 100 MB hard limit** for a single file. Anything larger is rejected
  outright, so a longer or higher-resolution recording will not push.
- Every version committed stays in the repository's history for good; `.git` is past 300 MB now.
- The page renders these around 1100px wide, so a visitor downloads roughly three times the pixels
  their screen can show, and the clips autoplay, so it happens whether they watch or not.

If that ever needs undoing, **Export settings** above has the one-line ffmpeg command.

## thread.mp4

The ticket thread: every message with its from and its whole to line, attachments listed on the
message they came on, inline images rendered in place, and reply / reply-all / forward under it.

**This one had to be re-encoded.** Your export is 186 MB, and GitHub refuses any file over 100 MB —
the push is rejected outright, so the original cannot live in the repo. The shipped file is the
same 3640x2160 and the same 55 seconds, re-encoded to **34 MB**; frames compared side by side at
1:1 are indistinguishable. If you ever want the original bytes served, put it on storage outside
git (Vercel Blob, S3, anything with a URL) and point `clip` at that URL instead of a local path.

## The rest of the shot list

One clip per flow still to come — the flows are numbered in the case study, and each slice in
`src/data.ts` takes a `clip` field the same way the showcase does.
