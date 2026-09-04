import { about, awards, experience, profile, projects, skills, socials } from '../data'
import { PANEL_TITLE, type PanelId } from '../three/views'
import ContactForm from './ContactForm'
import MiniBot from './MiniBot'

type Props = { id: PanelId | null; onClose: () => void }

function Body({ id }: { id: PanelId }) {
  switch (id) {
    case 'projects':
      return (
        <>
          {projects.map((p) => (
            <article className="pcard" key={p.title}>
              <div className="pcard__top">
                <strong>{p.title}</strong>
                <span className="card__year">{p.year}</span>
              </div>
              <p>{p.blurb}</p>
              <div className="card__tags">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              {p.href && (
                <a className="pcard__link" href={p.href} target="_blank" rel="noreferrer">
                  Open project ↗
                </a>
              )}
            </article>
          ))}
        </>
      )
    case 'about':
      return (
        <>
          <p className="panel__lead">{profile.tagline}</p>
          {about.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <div className="skills">
            {skills.map((g) => (
              <div className="skills__group" key={g.group}>
                <h3>{g.group}</h3>
                <div className="chips">
                  {g.items.map((i) => (
                    <span className="chip" key={i}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <h3 className="panel__h">Experience</h3>
          {experience.map((r) => (
            <div className="pcard" key={r.company}>
              <div className="pcard__top">
                <strong>{r.company}</strong>
                <span className="card__year">{r.period}</span>
              </div>
              <div className="role__title">{r.title}</div>
              <ul className="role__points">
                {r.points.map((pt) => (
                  <li key={pt.slice(0, 20)}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )
    case 'awards':
      return (
        <>
          <p className="panel__lead">Placeholder frames for now — real award photos go here.</p>
          {awards.map((a) => (
            <div className="pcard" key={a.title}>
              <div className="pcard__top">
                <strong>{a.title}</strong>
                <span className="card__year">{a.year}</span>
              </div>
              <div className="award__meta">{a.issuer}</div>
              {a.note && <p>{a.note}</p>}
            </div>
          ))}
        </>
      )
    case 'contact':
      return (
        <>
          <p className="panel__lead">
            Fastest: <a className="mailto" href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <ContactForm />
          <div className="chips">
            {socials.map((s) => (
              <a key={s.label} className="chip chip--btn" href={s.href} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
            ))}
          </div>
        </>
      )
    case 'resume':
      return profile.resumeUrl ? (
        <>
          <p className="panel__lead">One page, PDF.</p>
          <a className="btn btn--primary" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Open résumé ↗
          </a>
        </>
      ) : (
        <p className="panel__lead">Résumé PDF isn't uploaded yet. Drop it in <code>public/resume.pdf</code> and set <code>profile.resumeUrl</code>.</p>
      )
    case 'bot':
      return <MiniBot />
  }
}

export default function Panel({ id, onClose }: Props) {
  return (
    <aside className="panel" data-open={id !== null} aria-hidden={id === null}>
      {id && (
        <>
          <header className="panel__head">
            <h2 className="panel__title">{PANEL_TITLE[id]}</h2>
            <button className="iconbtn" onClick={onClose} aria-label="Close panel">
              ✕
            </button>
          </header>
          <div className="panel__body">
            <Body id={id} />
          </div>
        </>
      )}
    </aside>
  )
}
