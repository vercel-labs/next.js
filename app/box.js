'use client'
import { useId } from 'react'
export default function Box({ label }) {
  const id = useId()
  return <span data-id={id}>{label}</span>
}
