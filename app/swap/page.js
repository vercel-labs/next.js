'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
export default function P() {
  const [w, setW] = useState(400)
  useEffect(() => { setW(64) }, [])
  return <Image src="/ball.png" alt="a" width={w} height={w} priority />
}
