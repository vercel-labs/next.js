'use client'

export default function Page() {
  return (
    <details open onToggle={() => console.log('TOGGLE_FIRED')}>
      <summary>summary</summary>
      content
    </details>
  )
}
