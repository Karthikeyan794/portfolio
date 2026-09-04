import About from './About'
import Awards from './Awards'
import Contact from './Contact'
import Experience from './Experience'
import Hero from './Hero'
import Marquee from './Marquee'
import Nav from './Nav'
import Work from './Work'

type Props = { onEnterLab?: () => void }

/** The classic scrolling page — used on phones and as the 3D fallback. */
export default function Site2D({ onEnterLab }: Props) {
  return (
    <>
      <Nav onEnterLab={onEnterLab} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Awards />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
