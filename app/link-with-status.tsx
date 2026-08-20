'use client'
import Link from 'next/link'
import { useLinkStatus } from 'next/link'

function Pending() {
  const { pending } = useLinkStatus()
  return pending ? <span id="link-status-pending"> [useLinkStatus pending]</span> : null
}

export function LinkWithStatus({ id, href }: { id: string; href: string }) {
  return (
    <Link id={id} href={href} prefetch={false}>
      /link-status (prefetch=false + useLinkStatus indicator)
      <Pending />
    </Link>
  )
}
