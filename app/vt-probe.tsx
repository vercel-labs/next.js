'use client'

import { useEffect } from 'react'

// Records every real browser view transition started by React, plus every
// React <ViewTransition> callback, so a test can assert whether an animation ran.
export function VtProbe() {
  useEffect(() => {
    const w = window as any
    if (w.__vtPatched) return
    w.__vtPatched = true
    w.__vtLog = w.__vtLog || []
    const doc = document as any
    const original = doc.startViewTransition?.bind(document)
    if (original) {
      doc.startViewTransition = (...args: any[]) => {
        w.__vtLog.push('startViewTransition')
        return (original as any)(...args)
      }
    }
  }, [])
  return null
}
