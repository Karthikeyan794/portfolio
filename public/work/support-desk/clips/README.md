# Clips for the Support Desk case study

Checked 24 Sep 2026. **Nine of the nineteen flows under *How it works* have a recording.**

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
| 2 | Filtering the queue | `filter.mp4` | 59 MB · 3604×2160 | **original, byte for byte** |
| 3 | Merging duplicates, marking spam | release `merge.mp4` | 170 MB | **original** — upload pending |
| 6 | Auto-assign, and the fields | `assign.mp4` | 72 MB · 1592×1080 | **original, byte for byte** |
| 7 | A reply that starts written | release `reply.mp4` | 159 MB | **original** — upload pending |
| 8 | What the AI suggests | release `ai-suggestions.mp4` | 146 MB | **original** — upload pending |
| 9 | The thread and its attachments | release `thread.mp4` | 177 MB | **original** — upload pending |
| 13 | The customer view it produces | `customers.mp4` | 65 MB · 1820×1080 | **original, byte for byte** |
| 16 | A dashboard that reads zero | release `home.mp4` | 268 MB | **original** — upload pending |

Plus `overview.mp4` (24 MB · 1836×1080), the walkthrough beside the Overview.

### The release

The five over 100 MB live at
`https://github.com/Karthikeyan794/portfolio/releases/download/clips-v1/` — the `HD` constant in
`src/data.ts`. Release assets allow 2 GB per file, answer byte-range requests (so playback starts
before the download finishes) and do not count toward repository size.

**Until they are uploaded, each of those slices falls back to the smaller copy in `/public`**, so
the page is never broken by their absence. Files are staged and renamed ready to drag at
`~/Desktop/portfolio-clips-to-upload/`. Steps are in `ROADMAP.md` § 2h.

### Recorded but not wired up yet

`~/Desktop/Support desk videos/Views and filters.mp4` — 225 MB. Covers **#11, The view each person
works in**. Say the word and it goes on the release with the others.

---

## Still to record

Nine flows carry a diagram and no recording. Wiring one up is one line in `src/data.ts` beside its
heading — a slice can keep its diagram as well, the clip goes under it:

```ts
clip: '/work/support-desk/clips/<name>.mp4',
```

| # | Flow | Suggested file | What to film | ~sec |
|---|------|----------------|--------------|------|
| 4 | Who gets in | `gate.mp4` | The access gate where the desk would be: pick read or read-and-reply, add a note, request. Then the desk open, with the role showing | 20 |
| 5 | Assigning a ticket | `teams-card.mp4` | Pick a person from the roster — presence dot visible — then the card landing in Teams with the number, customer and link | 20 |
| 10 | Why a reply starts as a draft | `draft.mp4` | The composer on a ticket, the draft already written, edit a line, send | 15 |
| 11 | The view each person works in | *(already recorded — see above)* | — | — |
| 12 | Customers, built from the mail | `derive.mp4` | The customer list nobody typed: open a company, the people under it, then the mail address that produced it | 20 |
| 14 | The response clock | `sla.mp4` | A ticket's first-response and resolution counters, one overdue, and the same clock in the list column | 15 |
| 17 | How a ticket gets its type | `classify.mp4` | A ticket opening with its type and categories already set, then the subject it was read from | 15 |
| 18 | Did every mail become a ticket? | `reconcile.mp4` | The count in the mailbox against the count in the desk, and whatever surfaces the difference | 15 |
| 19 | The desk inside Teams | `teams-tab.mp4` | The desk running as a tab inside Teams — the same queue, in the other window | 20 |

**#15, *What the dashboard reads*, stays a diagram.** It is the column-by-column audit of 670 rows
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
