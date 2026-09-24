# Clips for the Support Desk case study

Checked 24 Sep 2026. **Nine of the fifteen flows under *How it works* have a recording.**

Record the demo, never the real desk: `~/Desktop/support-desk-demo/start-demo.command` (serves on
:8899). The demo runs on generated data (`support@demodesk.io`, `redgateretail.com`, fictional
people), so no real customer or colleague appears in any of this.

---

## What is in place

Nothing here is compressed to save space. Where a file was re-encoded it was because GitHub
**rejects any file over 100 MB outright** — not a quality decision. Those four now point at a
release instead, so the untouched exports are what visitors get.

| # | Flow | File | Size | State |
|---|------|------|------|-------|
| 1 | The queue | `queue.mp4` | 85 MB · 3692×2160 | **original, byte for byte** |
| 2 | All thirteen filters, and the view you save them as | release `views.mp4` | 225 MB · 3644×2160 · 128s | **original, on the release** — checked: serves all 236,273,045 bytes, range requests answered |
| 3 | Merging duplicates, marking spam | release `merge.mp4` | 170 MB | **original, live on the release** |
| 6 | Auto-assign, and the fields | `assign.mp4` | 72 MB · 1592×1080 | **original, byte for byte** |
| 7 | A reply that starts written | release `reply.mp4` | 159 MB | **original, live on the release** |
| 8 | What the assistant suggests, and how to check it | release `ai-suggestions.mp4` | 146 MB · 3644×2160 · 50s | **original, live on the release** |
| 9 | The thread and its attachments | release `thread.mp4` | 177 MB | **original, live on the release** |
| 11 | The customer view it produces | `customers.mp4` | 65 MB · 1820×1080 | **original, byte for byte** |
| 14 | A dashboard that reads zero | release `home.mp4` | 268 MB | **original, live on the release** |

**`filter.mp4` is gone.** It showed a status and a customer stacking over the queue — which is the
first half of what `views.mp4` shows, at higher quality and for longer. Two sections covering the
same filters, one of them a subset of the other, is a worse case study than one that runs filters
through to the view you save them as. The 59 MB came out of the deploy with it.

Plus `overview.mp4` (24 MB · 1836×1080), the walkthrough beside the Overview.

### The release

The six over 100 MB live at
`https://github.com/Karthikeyan794/portfolio/releases/download/clips-v1/` — the `HD` constant in
`src/data.ts`. Release assets allow 2 GB per file, answer byte-range requests (so playback starts
before the download finishes) and do not count toward repository size.

The release exists now (`clips-v1`, created 24 Sep 2026) and `views.mp4` is on it. **The other five
are still pending** — staged and renamed at `~/Desktop/portfolio-clips-to-upload/`, and since `gh`
is logged in on this machine they go up with one command:

```
gh release upload clips-v1 ~/Desktop/portfolio-clips-to-upload/{home,thread,merge,reply,ai-suggestions}.mp4
```

Until then each of those five falls back to the smaller copy in `/public`, so the page is never
broken by their absence. `views.mp4` has no smaller copy: if the release were ever unreachable the
row would show its words and diagram alone, which is by design — a hidden frame, not a broken one.

---

## Still to record

Six flows carry a diagram and no recording. Wiring one up is one line in `src/data.ts` beside its
heading — a slice can keep its diagram as well, the clip goes under it:

```ts
clip: '/work/support-desk/clips/<name>.mp4',
```

| # | Flow | Suggested file | What to film | ~sec |
|---|------|----------------|--------------|------|
| 4 | Who gets in | `gate.mp4` | The access gate where the desk would be: pick read or read-and-reply, add a note, request. Then the desk open, with the role showing | 20 |
| 5 | Assigning a ticket | `teams-card.mp4` | Pick a person from the roster — presence dot visible — then the card landing in Teams with the number, customer and link | 20 |
| 10 | Customers, built from the mail | `derive.mp4` | The customer list nobody typed: open a company, the people under it, then the mail address that produced it | 20 |
| 12 | The response clock | `sla.mp4` | A ticket's first-response and resolution counters, one overdue, and the same clock in the list column | 15 |
| 15 | The desk inside Teams | `teams-tab.mp4` | The desk running as a tab inside Teams — the same queue, in the other window | 20 |

**#13, *What the dashboard reads*, stays a diagram.** It is the column-by-column audit of 670 rows
— a finding, not a screen. There is nothing on it to film and the diagram says it better.

---

## Recording setup

### Before you press record

- Browser at **1440 × 900**, zoom 100%, full screen — no bookmarks bar, no other tabs
- Quit anything that shows a notification banner (Teams, Mail, Slack)
- Dark mode on, to match the page the clip plays in
- Have the screen already loaded before you start, so the first second opens on something

### While recording

Move slowly — a cursor that darts is unreadable at this size. Pause about a second on each screen
before clicking, so a viewer's eye lands before the screen changes.

### What not to film

- The mailbox-access gate, except for #4 where it is the subject
- Anything with a real address in it — check the top bar before you start
- Your own cursor hovering over a menu you then close; cut it, or do not do it

### Export

Export at whatever quality the recording came out at. **Do not compress to fit a size.** If a file
lands over 100 MB it goes on the release rather than in the repo — that is what the release is for,
and `clip` takes a full URL with no code change.

Keep **MP4 (H.264)**: it plays everywhere including Safari and iPhone, which WebM does not reliably
do. **Never ship a GIF** — the same recording is larger, capped at 256 colours, and cannot be
paused when it scrolls out of view.
