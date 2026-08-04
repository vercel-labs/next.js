'use client'

import { useState } from 'react'

export function NavbarClient() {
  const [count] = useState(0)

  return <nav id="navbar">Demo navigation: {count}</nav>
}
