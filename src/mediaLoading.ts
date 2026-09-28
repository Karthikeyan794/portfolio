/**
 * A shimmer while a picture or a clip is still on its way (the rules are in
 * styles.css, "media shimmer"). Every <img> and <video> shimmers until its
 * first load — a picture's load, a clip's metadata or first frame — or an
 * error marks it `data-loaded`, which stops it. One listener on the document
 * in the capture phase (load events do not bubble), so no component has to
 * opt in and media added later, on the case pages or as rows scroll in, is
 * covered too.
 */
const done = (e: Event) => {
  const t = e.target
  if (t instanceof HTMLImageElement || t instanceof HTMLVideoElement) t.dataset.loaded = ''
}
for (const type of ['load', 'loadedmetadata', 'loadeddata', 'error']) document.addEventListener(type, done, true)
