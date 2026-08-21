'use client'
import { redirect } from 'next/navigation'
export default function ClientPage() {
  // Per the website docs, redirect() is supported in Client Components.
  // The JSDoc in packages/next/src/client/components/redirect.ts omits Client Components.
  redirect('/target')
}
