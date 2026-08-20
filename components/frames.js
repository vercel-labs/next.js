// Records the visible text of the app subtree once per animation frame.
export function startRecorder() {
  if (typeof window === 'undefined' || window.__recording) return
  window.__recording = true
  window.__frames = []
  const tick = () => {
    const el = document.getElementById('app-root-wrapper')
    const txt = el ? el.innerText.replace(/\s+/g, ' ').trim() : '(no wrapper)'
    const last = window.__frames[window.__frames.length - 1]
    if (!last || last.text !== txt) {
      window.__frames.push({ t: Math.round(performance.now()), text: txt })
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
