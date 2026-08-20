'use client'
export default function Mismatch() {
  return <p>{typeof window === 'undefined' ? 'server text' : 'client text'}</p>
}
