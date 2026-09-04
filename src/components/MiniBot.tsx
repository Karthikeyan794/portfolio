import { useEffect, useRef, useState, type FormEvent } from 'react'
import { awards, experience, profile, projects, skills } from '../data'

type Msg = { from: 'bot' | 'you'; text: string }

const first = profile.name.split(' ')[0]

/** Keyword bot — answers from data.ts. Real LLM replaces this in Phase 4. */
const RULES: { match: RegExp; answer: () => string }[] = [
  { match: /\b(hi|hello|hey|yo)\b/i, answer: () => `Hi! I'm the lab assistant. Ask me about ${first}'s skills, projects, awards, experience or how to reach him.` },
  { match: /skill|stack|tech|know|language|framework/i, answer: () => `Main skills: ${skills.flatMap((g) => g.items).slice(0, 9).join(', ')}.` },
  { match: /project|work|built|build|portfolio/i, answer: () => `Recent projects: ${projects.map((p) => p.title).join(', ')}. Click the laptop on the desk for details.` },
  { match: /award|certif|achiev|recogni|won/i, answer: () => `${awards.length} so far — e.g. "${awards[0].title}" (${awards[0].issuer}, ${awards[0].year}). They're framed on the wall.` },
  { match: /contact|email|reach|hire|mail|talk/i, answer: () => `Email ${profile.email}, or tap the tablet on the desk for the contact form.` },
  { match: /where|locat|city|based|live/i, answer: () => `${first} is based in ${profile.location}.` },
  { match: /experience|company|job|role|currently|work at/i, answer: () => `${experience[0].title} at ${experience[0].company} (${experience[0].period}).` },
  { match: /resume|cv/i, answer: () => (profile.resumeUrl ? 'The résumé is the paper on the desk — click it.' : 'Résumé upload is pending. Email for a copy.') },
  { match: /available|open to|looking|freelance/i, answer: () => (profile.available ? `Yes — ${profile.availableNote.toLowerCase()}.` : 'Not looking right now, but always happy to chat.') },
  { match: /who|about|yourself|karthi|him/i, answer: () => profile.tagline },
]

const FALLBACK = `I only know about ${first} for now (the real AI arrives in Phase 4). Try: "skills", "projects", "awards", "experience", "contact".`

const SUGGESTIONS = ['What are his skills?', 'Show projects', 'Any awards?', 'How to contact?']

export default function MiniBot() {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: RULES[0].answer() }])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [msgs])

  function ask(q: string) {
    const text = q.trim()
    if (!text) return
    const rule = RULES.find((r) => r.match.test(text))
    const answer = rule ? rule.answer() : FALLBACK
    setMsgs((m) => [...m, { from: 'you', text }, { from: 'bot', text: answer }])
    setInput('')
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="bot">
      <div className="bot__log">
        {msgs.map((m, i) => (
          <div key={i} className={`bot__msg bot__msg--${m.from}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="bot__chips">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chip chip--btn" onClick={() => ask(s)}>
            {s}
          </button>
        ))}
      </div>
      <form className="bot__form" onSubmit={onSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Ask about ${first}…`} aria-label="Ask the assistant" />
        <button type="submit" className="btn btn--primary">
          Ask
        </button>
      </form>
    </div>
  )
}
