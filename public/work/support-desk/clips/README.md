# Clips for the Support Desk case study

Checked 24 Sep 2026. **Ten of the eleven flows under *How it works* have a recording.** Only *Assigning a ticket*
does not.

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
| 2 | The Ticket Thread | release `thread.mp4` | 177 MB | **original, live on the release** |
| 3 | All thirteen filters, and the view you save them as | release `views.mp4` | 225 MB · 3644×2160 · 128s | **original, on the release** — checked: serves all 236,273,045 bytes, range requests answered |
| 4 | Merging duplicates, marking spam | release `merge.mp4` | 170 MB | **original, live on the release** |
| 5 | Who gets in, and what they may do | release `Profile.menu.+.manage.access.mp4` | 128 MB · 3636×2160 · 69s | **original, live on the release** — recorded against the demo |
| 6 | Assigning a ticket | release `Team.notified.with.assigned.mp4` | 90 MB · 3188×2160 · 30s | **original, live on the release** — recorded against the real desk: colleagues’ names and work emails in the roster and the Teams sidebar |
| 7 | Auto-assign, and the fields | `assign.mp4` | 72 MB · 1592×1080 | **original, byte for byte** |
| 8 | A reply that starts written | release `reply.mp4` | 159 MB | **original, live on the release** |
| 9 | What the assistant suggests, and how to check it | release `ai-suggestions.mp4` | 146 MB · 3644×2160 · 50s | **original, live on the release** |
| 10 | The customer view it produces | `customers.mp4` | 65 MB · 1820×1080 | **original, byte for byte** |
| 11 | The response clock, and taking the record out | `sla.mp4` | 89 MB · 3636×2160 | **original, byte for byte** |
| 12 | A dashboard that reads zero | release `home.mp4` | 268 MB | **original, live on the release** |
| 13 | Milo — the desk, from inside Teams | release `Milio.workflow.chat.bot.in.term.mp4` | 79 MB · 3636×2160 · 46s | **original, live on the release** — uploaded by hand under the name GitHub gave the file; the page's address matches it |

**The Milo recording went up under its raw name** (`Milio.workflow.chat.bot.in.term.mp4`, dots
where the spaces were) on 24 Sep, and the page's address is matched to it. It was recorded against
the real desk rather than the demo, so the table in it shows real customers and subjects and the
status card names a colleague; putting it on a public release was your call. Renaming the asset to
`milo.mp4` is a one-click edit on the release page if you want the tidy address back — then change
the one line in `src/data.ts` to match.

**Both recordings that were sitting unwired are on the page now** (25 Sep 2026): the Teams
notification on *Assigning a ticket*, and *Who gets in* as a new row before it, written from the
manage-access recording. Both keep the names GitHub gave them on upload; the `+` in one of them
serves fine, literal or encoded, so nothing needed renaming.

`SLA+.download.mp4` is also there (89 MB) — it is byte for byte the `sla.mp4` already in the repo,
which the page uses; nothing to do.

**`filter.mp4` is gone.** It showed a status and a customer stacking over the queue — which is the
first half of what `views.mp4` shows, at higher quality and for longer. Two sections covering the
same filters, one of them a subset of the other, is a worse case study than one that runs filters
through to the view you save them as. The 59 MB came out of the deploy with it.

Plus the Overview panel at the top of the case study: **`overview.mp4`, the ticket page end to
end — 3636×2160, 636 MB, 3m35s**, replacing the 24-second 1836×1080 clip that was there. It is on
the release like the others. Until it is uploaded the panel shows its poster (`2-queue.jpg`)
rather than a dead frame.

Worth knowing: it is the largest file here and it sits at the top of the page, so it is the first
thing a visitor's browser reaches for. Range requests mean it streams rather than downloading
whole, and it pauses when it scrolls away or while the page is moving — but 3m35s is long for a
panel that loops. If it ever feels heavy, a shorter cut of the same recording is the fix, not a
lower bitrate.

### The release

The seven over 100 MB live at
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
row would show its words alone, which is by design — a hidden frame, not a broken one.

---

## Still to record

The drawn diagrams are gone from the case study (25 Sep 2026) — every flow is words and, where one
exists, its recording. A flow without a recording shows its words alone. Wiring one up is one line
in `src/data.ts` beside its heading:

```ts
clip: '/work/support-desk/clips/<name>.mp4',
```

| # | Flow | Suggested file | What to film | ~sec |
|---|------|----------------|--------------|------|
| 4 | Assigning a ticket | `teams-card.mp4` | Pick a person from the roster — presence dot visible — then the card landing in Teams with the number, customer and link | 20 |

**This one has to be shot on the demo.** The version recorded on the real desk cannot be used: it
carries live customer subjects and addresses, a colleague's mail address, the internal desk URL and
a dozen real names down the Teams sidebar. If the demo cannot post to a test Teams chat, film only
the assigning half; the Teams card can wait for a test chat — a drawing of it gives nothing
away.

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
