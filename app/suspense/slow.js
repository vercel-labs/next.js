'use client'
import Image from 'next/image'
import { Suspense, use, useState, useEffect } from 'react'

let promise
function getPromise() {
  if (!promise) promise = new Promise((r) => setTimeout(r, 8000))
  return promise
}
function Blocker() {
  if (typeof window !== 'undefined') use(getPromise())
  return null
}
export default function Slow() {
  return (
    <div>
      <Image src="/ball.png" alt="hero" width={400} height={400} priority />
      <Blocker />
    </div>
  )
}
