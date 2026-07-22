'use client'

import { useEffect, useState } from 'react'
import { getPublicEnv } from './env'

export default function ClientValue() {
  const [value, setValue] = useState('pending')

  useEffect(() => {
    setValue(getPublicEnv() ?? 'undefined')
  }, [])

  return <p id="client-value">{value}</p>
}
