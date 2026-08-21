'use client'

export default function Error({ error }) {
  return <h1 id="error-boundary">Error boundary rendered: {String(error?.message)}</h1>
}
