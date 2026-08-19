'use client'
import { useState } from 'react'

const STEPS = ['Step one: your details', 'Step two: your address', 'Step three: review']

export default function Page() {
  const [step, setStep] = useState(0)
  return (
    <main>
      <h1>{STEPS[step]}</h1>
      <button id="continue" onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}>
        Continue
      </button>
    </main>
  )
}
