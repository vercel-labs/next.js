'use client'

import { useEffect, useState } from 'react'

function readFiberDebugInfo(id) {
  const el = document.getElementById(id)
  if (!el) return { id, error: 'element not found' }
  const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$'))
  if (!key) return { id, error: 'no __reactFiber$ key' }
  const fiber = el[key]
  return {
    id,
    fiberType: String(fiber.type),
    hasDebugSource: Boolean(fiber._debugSource),
    debugSource: fiber._debugSource
      ? {
          fileName: fiber._debugSource.fileName,
          lineNumber: fiber._debugSource.lineNumber,
        }
      : fiber._debugSource === undefined
        ? 'undefined'
        : 'null',
    debugInfo: fiber._debugInfo
      ? JSON.stringify(fiber._debugInfo).slice(0, 300)
      : String(fiber._debugInfo),
    debugStack: fiber._debugStack ? 'present' : String(fiber._debugStack),
    debugOwnerName:
      fiber._debugOwner && fiber._debugOwner.type
        ? fiber._debugOwner.type.name || String(fiber._debugOwner.type)
        : fiber._debugOwner === undefined
          ? 'undefined'
          : 'null',
  }
}

export default function Inspector() {
  const [result, setResult] = useState(null)
  useEffect(() => {
    const out = {
      reactVersion: require('react').version,
      server: readFiberDebugInfo('server-el'),
      client: readFiberDebugInfo('client-el'),
    }
    // eslint-disable-next-line no-console
    console.log('FIBER_DEBUG_REPORT ' + JSON.stringify(out))
    setResult(out)
  }, [])
  return (
    <pre id="result">{result ? JSON.stringify(result, null, 2) : 'pending'}</pre>
  )
}
