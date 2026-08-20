'use client'
import { useEffect } from 'react'
export default function Probe() {
  useEffect(() => {
    window.__frames = []
    const tick = () => {
      const el = document.querySelector('[data-target]')
      window.__frames.push({
        t: Math.round(performance.now()),
        bodyBg: getComputedStyle(document.body).backgroundColor,
        elBg: el ? getComputedStyle(el).backgroundColor : 'none',
        font: getComputedStyle(document.body).fontFamily.slice(0, 30),
        sheets: document.querySelectorAll('link[rel=stylesheet]').length + '/' + document.querySelectorAll('style').length,
      })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])
  return null
}
