import { useEffect, useState } from 'react'

/**
 * Hash routing — works on any static host with no server rules.
 *   #top / #work / …      → the one-page site, anchors as usual
 *   #/project/<slug>      → a case-study page
 */
export function projectSlugFromHash(hash = window.location.hash) {
  const m = hash.match(/^#\/project\/([\w-]+)/)
  return m ? m[1] : null
}

export function useRoute() {
  const [slug, setSlug] = useState<string | null>(() => projectSlugFromHash())
  useEffect(() => {
    const onHash = () => setSlug(projectSlugFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return slug
}

export function openProject(slug: string) {
  window.location.hash = `#/project/${slug}`
}

export function closeProject() {
  // back to the work section rather than the very top
  window.location.hash = '#work'
}
