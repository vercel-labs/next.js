'use client'

import { useState } from 'react'

function directThrow() {
  throw new Error('direct error')
}

export default function Page() {
  const [log, setLog] = useState<string[]>([])
  const note = (message: string) => setLog((previous) => [...previous, message])

  const cases = [
    {
      label: 'Direct throw',
      run: () => {
        note('direct')
        directThrow()
      },
    },
    {
      label: 'Timeout',
      run: () => {
        note('timeout')
        setTimeout(() => {
          throw new Error('timeout error')
        }, 0)
      },
    },
    {
      label: 'Rejected promise',
      run: () => {
        note('rejection')
        void Promise.reject(new Error('rejection error'))
      },
    },
    {
      label: 'Reported error',
      run: () => {
        note('reported')
        console.error(new Error('reported error'))
      },
    },
  ]

  return (
    <>
      {cases.map((testCase) => (
        <button key={testCase.label} onClick={testCase.run}>
          {testCase.label}
        </button>
      ))}
      <pre>{log.join('\n')}</pre>
    </>
  )
}
