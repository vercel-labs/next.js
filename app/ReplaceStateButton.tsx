'use client'

export function ReplaceStateButton() {
  return (
    <button
      id="replace"
      onClick={() => {
        window.history.replaceState(null, '', `?test=${Date.now()}`)
      }}
    >
      change history
    </button>
  )
}
