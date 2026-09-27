import { useEffect, useState } from 'react'
import ContactModal from './ContactModal'

/**
 * The end of the home page: nothing on show, just the contact dialog. It
 * lives here, because the nav's Contact button
 * opens it with an `open-contact` event and this is the component listening.
 */

export default function Contact() {
  const [open, setOpen] = useState(false)

  // the nav's Contact button opens the same dialog
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-contact', onOpen)
    return () => window.removeEventListener('open-contact', onOpen)
  }, [])

  return (
    <section className="reach" id="contact" aria-label="Contact">
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
