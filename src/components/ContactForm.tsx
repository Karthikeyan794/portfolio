import { useState, type FormEvent } from 'react'
import { profile } from '../data'

/** Contact form. Until a backend exists it opens the visitor's email app pre-filled. */
export default function ContactForm() {
  const [done, setDone] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '')
    const email = String(fd.get('email') ?? '')
    const message = String(fd.get('message') ?? '')
    const subject = encodeURIComponent(`Portfolio — message from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setDone(true)
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__row">
        <label className="field">
          Name
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <label className="field">
        Message
        <textarea name="message" required placeholder="What are you building?" />
      </label>
      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          Send message
        </button>
        <span className="form__note">{done ? 'Your email app should have opened.' : 'Opens your email app for now — direct sending comes in Phase 5.'}</span>
      </div>
    </form>
  )
}
