'use client'

import { useEffect } from 'react'

/**
 * Minimal, deterministic stand-in for Chrome's built-in (Google) translation.
 * Chrome replaces text nodes with `<font>` wrappers containing the translated
 * text node, which steals nodes React still owns. This does exactly that for
 * every text node it sees, including inside shadow roots (the Next.js route
 * announcer lives in a shadow root).
 */
function wrap(textNode) {
  if (!textNode.parentNode) return
  if (textNode.parentNode.tagName === 'FONT') return
  if (!textNode.nodeValue || !textNode.nodeValue.trim()) return
  const font = document.createElement('font')
  font.setAttribute('data-fake-translate', '')
  textNode.parentNode.insertBefore(font, textNode)
  // Chrome moves the original text node into the <font> wrapper.
  font.appendChild(textNode)
  textNode.nodeValue = '[translated] ' + textNode.nodeValue
}

function walk(root) {
  const nodes = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let n
  while ((n = walker.nextNode())) nodes.push(n)
  nodes.forEach(wrap)
  // Recurse into shadow roots (route announcer uses one).
  const els = root.querySelectorAll ? root.querySelectorAll('*') : []
  els.forEach((el) => {
    const sr = el.shadowRoot
    if (sr) {
      observe(sr)
      walk(sr)
    }
  })
}

const observed = new WeakSet()
let observer

function observe(root) {
  if (observed.has(root)) return
  observed.add(root)
  observer.observe(root, { childList: true, subtree: true, characterData: true })
}

export default function FakeGoogleTranslate() {
  useEffect(() => {
    observer = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) wrap(node)
          else walk(node)
        })
        if (r.target.nodeType === Node.ELEMENT_NODE) walk(r.target)
      }
    })
    observe(document.body)
    walk(document.body)
    // eslint-disable-next-line no-console
    console.log('[fake-google-translate] active')
  }, [])
  return null
}
