'use client'
export default function Error({ error }) {
  return <p id="error-boundary">error.tsx: {error.message}</p>
}
