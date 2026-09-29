/**
 * Everything the "Ask about me" chat may say, as one plain text — built from
 * the same exports the site renders (src/data.ts), plus `askMe.resume` for
 * what only the résumé adds. So the chat can never disagree with the page, and
 * there is nothing to keep in step by hand.
 *
 * Left out on purpose: `about` and `skills` in data.ts are early placeholders
 * the site no longer shows (they name tools I don't use), and the demos' and
 * clips' plumbing. The underscore keeps Vercel from serving this as a route.
 */
import {
  askMe,
  awards,
  currently,
  education,
  experience,
  intro_about,
  places,
  playlist,
  profile,
  projects,
  socials,
  stackCards,
} from '../src/data'

const SITE = 'https://www.karthikeyan.design'
/** the page's *emphasis* marks, which mean nothing to the model */
const plain = (s: string) => s.replace(/\*/g, '').replace(/\s+/g, ' ').trim()

function projectFacts(): string {
  return projects
    .map((p) => {
      const lines = [`## ${p.title} (${p.year})`, `Tagline: ${plain(p.tagline)}`, `About: ${plain(p.blurb)}`]
      if (p.role) lines.push(`My role: ${p.role}`)
      if (p.tags.length) lines.push(`Tags: ${p.tags.join(', ')}`)
      if (p.detail) lines.push(`Case study: ${SITE}/#/project/${p.slug}`)
      else if (p.behance) lines.push(`On Behance: ${p.behance}`)
      if (p.inProgress) lines.push('Status: the case study is still being written.')
      const d = p.detail
      if (d) {
        for (const f of d.facts) lines.push(`${f.label}: ${f.value}`)
        if (d.primer) lines.push(`Overview: ${plain(d.primer.what)}`)
        if (d.brief) {
          lines.push(`The problem: ${plain(d.brief.problem.lead)} ${plain(d.brief.problem.body)}`)
          lines.push(`The solution: ${plain(d.brief.solution.lead)} ${plain(d.brief.solution.body)}`)
        }
        for (const s of d.slices) {
          if (!s.heading || !s.body) continue
          lines.push(`- ${plain(s.heading)}: ${plain(s.body)}`)
        }
        if (p.demo) lines.push(`There is a clickable demo inside the case study (made-up data).`)
      }
      return lines.join('\n')
    })
    .join('\n\n')
}

export function buildFacts(): string {
  const tools = stackCards.map((c) => `${c.label}: ${c.tools.map((t) => t.name).join(', ')}`).join('\n')
  const roles = experience
    .map((r) => `${r.title} at ${r.company} (${r.period}${r.place ? `, ${r.place}` : ''}): ${r.points.join(' ')}${r.stack?.length ? ` Tools: ${r.stack.join(', ')}.` : ''}`)
    .join('\n')
  const schools = education.map((e) => `${e.course}, ${e.school} (${e.years})`).join('\n')
  const where = places.map((p) => `${p.label}: ${p.city}, ${p.country}`).join('; ')
  const links = socials.map((s) => `${s.label}: ${s.href}`).join('\n')
  const songs = playlist.tracks.map((t) => `${t.title} (${t.artist})`).join('; ')

  return `# Karthikeyan B
Role: ${profile.role}
Based in: ${profile.location}. ${where}
Tagline: ${profile.tagline}
Availability: ${profile.available ? profile.availableNote : 'Not looking right now.'}
Now: ${currently.role} at ${currently.at}, working on ${currently.focus}.

# In my own words
${intro_about.paragraphs.map(plain).join('\n')}

# From my résumé
${askMe.resume}

# Experience
${roles}

# Education
${schools}

# Toolkit (as shown on the site)
${tools}

# Recognition
${awards.map((a) => `${a.title}, ${a.issuer}${a.year ? ` (${a.year})` : ''}`).join('; ')}

# Projects
${projectFacts()}

# Contact
Email: ${profile.email}
Phone: ${profile.phone}
Résumé (PDF): ${SITE}${profile.resumeUrl}
${links}
Portfolio: ${SITE}

# Small things
On repeat while building: ${songs}.
Away from work: drawing, video editing and side projects.`
}
