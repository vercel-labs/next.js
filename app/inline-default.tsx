'use client'

type MyProps = {
  myFunc: () => void
}

// Control: `export default function` (inline) — warns as expected
export default function inlineDefault({ myFunc }: MyProps) {
  myFunc()
  return <></>
}
