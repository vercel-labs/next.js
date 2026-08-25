'use client'
export default function GlobalError(): never {
  throw new Error('global error recovery failed')
}
