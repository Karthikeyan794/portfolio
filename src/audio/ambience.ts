/**
 * Procedural mountain ambience — no audio file, nothing to license, loops forever.
 *   wind    : brown noise → low-pass whose cutoff drifts slowly (gusts)
 *   leaves  : occasional short high band-passed noise swells
 *   birds   : occasional 2–4 note chirps (sine sweeps) placed left/right in the stereo field
 * start() must be called from a user gesture (browser autoplay rule).
 */
export class Ambience {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private timers: number[] = []
  private target = 0.28
  private starting: Promise<void> | null = null
  running = false

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

    this.wind(ctx, master)
    this.scheduleLeaves(ctx, master)
    this.scheduleBirds(ctx, master)

    await ctx.resume()
    master.gain.linearRampToValueAtTime(this.target, ctx.currentTime + 2.5)
    this.running = true
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

  private wind(ctx: AudioContext, out: GainNode) {
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer(ctx, 6, true)
    src.loop = true
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    lp.Q.value = 0.6
    // gusts: slow LFO on the cutoff and on the level
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 260
    lfo.connect(lfoGain).connect(lp.frequency)
    const g = ctx.createGain()
    g.gain.value = 0.55
    const lfo2 = ctx.createOscillator()
    lfo2.frequency.value = 0.045
    const lfo2Gain = ctx.createGain()
    lfo2Gain.gain.value = 0.18
    lfo2.connect(lfo2Gain).connect(g.gain)
    src.connect(lp).connect(g).connect(out)
    src.start()
    lfo.start()
    lfo2.start()
  }

  private scheduleLeaves(ctx: AudioContext, out: GainNode) {
    const tick = () => {
      if (!this.running && this.ctx !== ctx) return
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer(ctx, 1.5, false)
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 2600 + Math.random() * 1800
      bp.Q.value = 0.8
      const g = ctx.createGain()
      const t = ctx.currentTime
      const dur = 0.9 + Math.random() * 1.1
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.04, t + dur * 0.45)
      g.gain.linearRampToValueAtTime(0, t + dur)
      const pan = ctx.createStereoPanner()
      pan.pan.value = Math.random() * 1.6 - 0.8
      src.connect(bp).connect(g).connect(pan).connect(out)
      src.start(t)
      src.stop(t + dur + 0.05)
      this.timers.push(window.setTimeout(tick, 2500 + Math.random() * 5000))
    }
    this.timers.push(window.setTimeout(tick, 1500))
  }

  private scheduleBirds(ctx: AudioContext, out: GainNode) {
    const chirp = (at: number, base: number, pan: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      const g = ctx.createGain()
      const p = ctx.createStereoPanner()
      p.pan.value = pan
      const len = 0.09 + Math.random() * 0.08
      osc.frequency.setValueAtTime(base, at)
      osc.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.35), at + len * 0.6)
      osc.frequency.exponentialRampToValueAtTime(base * 0.95, at + len)
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(0.035, at + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0005, at + len)
      osc.connect(g).connect(p).connect(out)
      osc.start(at)
      osc.stop(at + len + 0.02)
    }
    const tick = () => {
      if (!this.running && this.ctx !== ctx) return
      const t = ctx.currentTime + 0.05
      const notes = 2 + Math.floor(Math.random() * 3)
      const base = 2200 + Math.random() * 1800
      const pan = Math.random() * 1.6 - 0.8
      for (let i = 0; i < notes; i++) chirp(t + i * (0.14 + Math.random() * 0.08), base * (1 + (Math.random() - 0.5) * 0.1), pan)
      this.timers.push(window.setTimeout(tick, 3000 + Math.random() * 7000))
    }
    this.timers.push(window.setTimeout(tick, 2500))
  }
}

export const ambience = new Ambience()
