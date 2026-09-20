# Clips for the Support Desk case study

**In place now:** `overview.mp4` — the walkthrough that plays in the panel beside the Overview
(home, the queue, a thread, a reply going out, the detail panel). It came from the 50 MB screen
recording on the Desktop (`Support desk videos/Google Chrome.gif`, 1748x1080, 26s).

**Always ship video, never the GIF.** The same 26 seconds:

| format | size |
| --- | --- |
| GIF, as recorded | 50 MB |
| WebM / VP9 | 2.3 MB |
| **MP4 / H.264, full 1748x1080 (shipped)** | **0.44 MB** |

A GIF is capped at 256 colours, cannot be paused when it scrolls out of view, and here was ~180x
heavier than the MP4 for worse pictures. MP4 also plays everywhere, including Safari and iOS,
which WebM does not reliably do. The still at `../2-queue.jpg` is the video's poster, so the panel is
never empty while it loads.

There is no ffmpeg on this machine. The encode was done by playing the GIF into a canvas in
headless Chrome and recording that canvas with MediaRecorder (`video/mp4;codecs=avc1.4D401F`,
1748x1080 — the recording's own size, never downscaled — 15fps, 9 Mbps ceiling). Replace the file at the same path to swap the clip.

# Flow clips

One short screen recording per flow, played under the diagram that explains it.
Record them from the demo (`~/Desktop/support-desk-demo/start-demo.command`) so no
customer data is on screen.

| File | The flow it shows | What to capture (10–20s, no audio needed) |
|---|---|---|
| `access.mp4` | Flow 1 — who gets in | The gate, picking Read + Reply, Request, the waiting screen, then the desk opening |
| `assign.mp4` | Flow 2 — assign + Teams | Opening the assignee picker, picking a person, then the card arriving in Teams |
| `reply.mp4` | Flow 3 — a reply that starts written | Composer opening on the template, the AI suggestion beside it, editing, sending |
| `views.mp4` | Flow 5 — saved views | Setting filters, saving with a name, switching between mine and shared |
| `customer.mp4` | Flow 6 — the customer view | Accounts → the people in one → that person's tickets |
| `sla.mp4` | Flow 7 — the clocks | A ticket with a running response clock, and one that has stopped |
| `dashboard.mp4` | Flow 8 — dashboards | Changing the period and watching the intake chart redraw |
| `intake.mp4` | Flow 9 — the intake check | Opening the check and reading conversations against tickets, per address |
| `teams.mp4` | Flow 10 — the Teams bot | @mentioning the bot, `create`, then `status` on the card that comes back |

## Wiring one up

Drop the file here, then add one line to that slice in `src/data.ts`:

```ts
clip: '/work/support-desk/clips/assign.mp4',
```

It renders under the diagram, autoplaying, looped and muted. A `.gif` works too —
the code picks `<img>` for gifs and `<video>` for everything else.

Keep each file small (an MP4 under ~3 MB); they load on the case-study page.
