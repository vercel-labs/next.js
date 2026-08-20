'use client'
import { useEffect } from 'react'

// Mimics next-themes: client mutates the theme-color meta after hydration
export function MetaTheme() {
  useEffect(() => {
    const apply = () =>
      document
        .querySelectorAll("meta[name='theme-color']")
        .forEach((m) => m.setAttribute('content', '#ff0000'))
    apply()
  }, [])
  return null
}
