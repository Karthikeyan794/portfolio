/**
 * Procedural mountain ambience — no audio file, nothing to license, loops forever.
 *   wind    : brown noise → low-pass whose cutoff drifts slowly (gusts)
 *   leaves  : occasional short high band-passed noise swells
 *   birds   : occasional 2–4 note chirps (sine sweeps) placed left/right in the stereo field
 *             — by day. At night (the dark theme's garden) crickets take their place.
 * And three small sounds for the page itself, only while the sound is on:
 *   click   : a soft tick when a button or link is pressed
 *   sparkle : a tiny glassy chime when a firefly flares (Fireflies.tsx calls it)
 * start() must be called from a user gesture (browser autoplay rule).
 */
const MUTE_KEY = 'portfolio:sound' // 'off' when the visitor muted it

export class Ambience {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private timers: number[] = []
  private target = 0.28
  private starting: Promise<void> | null = null
  private listeners = new Set<() => void>()
  private night = false
  private lastSparkle = 0
  running = false

  /** night garden (dark theme): crickets instead of birds */
  setNight(v: boolean) {
    this.night = v
  }

  /** Did the visitor switch sound off on an earlier visit? */
  get muted() {
    try {
      return localStorage.getItem(MUTE_KEY) === 'off'
    } catch {
      return false
    }
  }
  set muted(v: boolean) {
    try {
      if (v) localStorage.setItem(MUTE_KEY, 'off')
      else localStorage.removeItem(MUTE_KEY)
    } catch {
      /* ignore */
    }
    this.emit()
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }
  private emit() {
    this.listeners.forEach((fn) => fn())
  }

  /**
   * Start on the visitor's first click / tap / key anywhere — browsers only allow
   * sound after a gesture. Call once, as early as possible (before the loader ends).
   */
  armOnGesture() {
    if (this.muted || this.running) return () => {}
    const off = () => {
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
    }
    const arm = () => {
      if (this.muted) return off()
      this.start()
        .then(off)
        .catch(() => {
          /* blocked this time — stay armed for the next gesture */
        })
    }
    window.addEventListener('pointerdown', arm)
    window.addEventListener('keydown', arm)
    return off
  }

  start() {
    if (this.running) return Promise.resolve()
    if (!this.starting) {
      this.starting = this.boot().finally(() => {
        this.starting = null
      })
    }
    return this.starting
  }

  private async boot() {
    const ctx = new AudioContext()
    this.ctx = ctx
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    this.master = master

    this.pad(ctx, master)
    this.wind(ctx, master)
    this.scheduleLeaves(ctx, master)
    this.scheduleBirds(ctx, master)
    this.scheduleCrickets(ctx, master)
    window.addEventListener('click', this.onClick, true)

    await ctx.resume()
    master.gain.linearRampToValueAtTime(this.target, ctx.currentTime + 4)
    this.running = true
    this.emit()
  }

  /** 0..1 — used to duck the level once you scroll past the hero */
  setLevel(level: number) {
    this.target = 0.28 * level
    if (this.ctx && this.master && this.running) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime)
      this.master.gain.setTargetAtTime(this.target, this.ctx.currentTime, 0.6)
    }
  }

  async stop() {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
    this.timers.forEach((t) => window.clearTimeout(t))
    this.timers = []
    this.running = false
    window.removeEventListener('click', this.onClick, true)
    this.emit()
    await new Promise((r) => setTimeout(r, 900))
    await ctx.close()
    this.ctx = null
    this.master = null
  }

  suspend() { void this.ctx?.suspend() }
  resume() { if (this.running) void this.ctx?.resume() }

  // ── layers ────────────────────────────────────────────────────────
  private noiseBuffer(ctx: AudioContext, seconds: number, brown: boolean) {
    const buf = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      let last = 0
      for (let i = 0; i < d.length; i++) {
        const white = Math.random() * 2 - 1
        if (brown) {
          last = (last + 0.02 * white) / 1.02
          d[i] = last * 3.5
        } else d[i] = white
      }
    }
    return buf
  }

  /** a soft, slow breeze — two low-pass stages take the hiss out, gusts are gentle */
  private wind(ctx: AudioContext, out: GainNode) {
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer(ctx, 6, true)
    src.loop = true
    const lp1 = ctx.createBiquadFilter()
    lp1.type = 'lowpass'
    lp1.frequency.value = 300
    lp1.Q.value = 0.4
    const lp2 = ctx.createBiquadFilter()
    lp2.type = 'lowpass'
    lp2.frequency.value = 900
    lp2.Q.value = 0.3
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 120
    lfo.connect(lfoGain).connect(lp1.frequency)
    const g = ctx.createGain()
    g.gain.value = 0.08 // just a hint of air
    const lfo2 = ctx.createOscillator()
    lfo2.frequency.value = 0.035
    const lfo2Gain = ctx.createGain()
    lfo2Gain.gain.value = 0.03
    lfo2.connect(lfo2Gain).connect(g.gain)
    src.connect(lp1).connect(lp2).connect(g).connect(out)
    src.start()
    lfo.start()
    lfo2.start()
  }

  /** a warm, barely-there drone (A major-ish) with a slow filter breath — the "smooth" in the mix */
  private pad(ctx: AudioContext, out: GainNode) {
    const notes = [110, 164.81, 220, 277.18, 329.63] // A2 E3 A3 C#4 E4
    const bus = ctx.createGain()
    bus.gain.value = 0.05
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 520
    lp.Q.value = 0.5
    const breathe = ctx.createOscillator()
    breathe.frequency.value = 0.03
    const breatheGain = ctx.createGain()
    breatheGain.gain.value = 180
    breathe.connect(breatheGain).connect(lp.frequency)
    breathe.start()
    notes.forEach((f, i) => {
      for (const detune of [-4, 4]) {
        const osc = ctx.createOscillator()
        osc.type = i < 2 ? 'sine' : 'triangle'
        osc.frequency.value = f
        osc.detune.value = detune
        const g = ctx.createGain()
        g.gain.value = i < 2 ? 0.35 : 0.16
        // each voice swells on its own slow cycle so the chord never sits still
        const lfo = ctx.createOscillator()
        lfo.frequency.value = 0.02 + i * 0.007
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = g.gain.value * 0.45
        lfo.connect(lfoGain).connect(g.gain)
        lfo.start()
        const pan = ctx.createStereoPanner()
        pan.pan.value = (i / (notes.length - 1)) * 1.2 - 0.6
        osc.connect(g).connect(pan).connect(bus)
        osc.start()
      }
    })
    bus.connect(lp).connect(out)
  }

  private scheduleLeaves(ctx: AudioContext, out: GainNode) {
    const tick = () => {
      if (!this.running && this.ctx !== ctx) return
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer(ctx, 1.5, false)
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 1800 + Math.random() * 1200
      bp.Q.value = 0.6
      const g = ctx.createGain()
      const t = ctx.currentTime
      const dur = 2 + Math.random() * 2
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.018 + Math.random() * 0.012, t + dur * 0.5)
      g.gain.linearRampToValueAtTime(0, t + dur)
      const pan = ctx.createStereoPanner()
      pan.pan.value = Math.random() * 1.6 - 0.8
      src.connect(bp).connect(g).connect(pan).connect(out)
      src.start(t)
      src.stop(t + dur + 0.05)
      this.timers.push(window.setTimeout(tick, 6000 + Math.random() * 8000))
    }
    this.timers.push(window.setTimeout(tick, 4000))
  }

  private scheduleBirds(ctx: AudioContext, out: GainNode) {
    const chirp = (at: number, base: number, pan: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      const g = ctx.createGain()
      const p = ctx.createStereoPanner()
      p.pan.value = pan
      const len = 0.14 + Math.random() * 0.1
      osc.frequency.setValueAtTime(base, at)
      osc.frequency.exponentialRampToValueAtTime(base * (1.15 + Math.random() * 0.2), at + len * 0.6)
      osc.frequency.exponentialRampToValueAtTime(base * 0.97, at + len)
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(0.034, at + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0004, at + len)
      osc.connect(g).connect(p).connect(out)
      osc.start(at)
      osc.stop(at + len + 0.02)
    }
    const song = (t: number, base: number, pan: number) => {
      const notes = 2 + Math.floor(Math.random() * 4)
      for (let i = 0; i < notes; i++) chirp(t + i * (0.13 + Math.random() * 0.09), base * (1 + (Math.random() - 0.5) * 0.12), pan)
    }
    const tick = () => {
      if (!this.running && this.ctx !== ctx) return
      if (this.night) {
        // no birds after dark: check back soon in case the theme flips
        this.timers.push(window.setTimeout(tick, 3000))
        return
      }
      const t = ctx.currentTime + 0.05
      const pan = Math.random() * 1.6 - 0.8
      song(t, 1800 + Math.random() * 1400, pan)
      // sometimes a second bird answers from the other side
      if (Math.random() < 0.45) song(t + 0.7 + Math.random() * 0.6, 2400 + Math.random() * 1200, -pan)
      this.timers.push(window.setTimeout(tick, 2500 + Math.random() * 4000))
    }
    this.timers.push(window.setTimeout(tick, 1800))
  }

  /** crickets at night: short trains of bright pulses, a few voices near and far */
  private scheduleCrickets(ctx: AudioContext, out: GainNode) {
    // one chirp is 3–4 very fast pulses of a pure ~4.5 kHz tone
    const chirp = (at: number, freq: number, pan: number, level: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = 0
      const p = ctx.createStereoPanner()
      p.pan.value = pan
      const pulses = 3 + Math.floor(Math.random() * 2)
      for (let i = 0; i < pulses; i++) {
        const s = at + i * 0.028
        g.gain.setValueAtTime(0, s)
        g.gain.linearRampToValueAtTime(level, s + 0.006)
        g.gain.linearRampToValueAtTime(0, s + 0.02)
      }
      osc.connect(g).connect(p).connect(out)
      osc.start(at)
      osc.stop(at + pulses * 0.028 + 0.05)
    }
    // each voice keeps its own pitch, place and pace, like a real cricket
    const voices = [0, 1, 2].map((i) => ({
      freq: 4200 + Math.random() * 900,
      pan: [-0.7, 0.15, 0.65][i] + (Math.random() - 0.5) * 0.2,
      level: [0.011, 0.007, 0.004][i],
      gap: 0.34 + Math.random() * 0.22,
    }))
    const tick = () => {
      if (!this.running && this.ctx !== ctx) return
      if (this.night) {
        const now = ctx.currentTime + 0.05
        for (const v of voices) {
          // a run of chirps, then a rest: not every voice sings every time
          if (Math.random() < 0.3) continue
          const runs = 3 + Math.floor(Math.random() * 5)
          for (let i = 0; i < runs; i++) chirp(now + Math.random() * 0.2 + i * v.gap, v.freq, v.pan, v.level)
        }
      }
      this.timers.push(window.setTimeout(tick, 2600 + Math.random() * 2400))
    }
    this.timers.push(window.setTimeout(tick, 1200))
  }

  /** a soft tick for a press — short and low, so it never gets tiring */
  click() {
    const ctx = this.ctx
    if (!ctx || !this.running || !this.master) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1150, t)
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.07)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.22, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.09)
    // straight to the speakers, not through the ducked ambience level
    osc.connect(g).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.1)
  }
  private onClick = (e: MouseEvent) => {
    if ((e.target as Element | null)?.closest('button, a, [role="button"], summary, label')) this.click()
  }

  /**
   * A tiny glassy chime as a firefly flares. `pan` is where it is, -1 left to
   * 1 right; `size` 0..1 how bright. Rationed, so a busy garden stays calm.
   */
  sparkle(pan = 0, size = 0.5) {
    const ctx = this.ctx
    if (!ctx || !this.running || !this.master) return
    const now = performance.now()
    if (now - this.lastSparkle < 420) return
    this.lastSparkle = now
    const t = ctx.currentTime
    // a note from a high pentatonic, with a quieter fifth above it
    const scale = [1568, 1760, 2093, 2349, 2637, 3136]
    const base = scale[Math.floor(Math.random() * scale.length)]
    const p = ctx.createStereoPanner()
    p.pan.value = Math.max(-1, Math.min(1, pan))
    // a short echo gives it the shimmer of glass
    const echo = ctx.createDelay(0.5)
    echo.delayTime.value = 0.13
    const fb = ctx.createGain()
    fb.gain.value = 0.32
    echo.connect(fb).connect(echo)
    const bus = ctx.createGain()
    bus.gain.value = 0.55 + size * 0.45
    bus.connect(p)
    bus.connect(echo)
    echo.connect(p)
    p.connect(this.master)
    for (const [mult, level] of [[1, 0.05], [1.5, 0.018], [3, 0.008]] as const) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = base * mult
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(level, t + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1)
      osc.connect(g).connect(bus)
      osc.start(t)
      osc.stop(t + 1.2)
    }
  }
}

export const ambience = new Ambience()
