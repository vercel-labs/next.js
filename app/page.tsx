'use client'
import { useGlobal } from './GlobalProvider'

export default function Page() {
  const width = useGlobal()
  return <p id="w">window.innerWidth from provider: {String(width)}</p>
}
