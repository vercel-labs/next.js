'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function Nav() {
  const pathname = usePathname()
  const item = (href, label) => (
    <Link
      href={href}
      prefetch={false}
      id={'link-' + label}
      style={{
        marginRight: 16,
        fontWeight: pathname === href ? 'bold' : 'normal',
        color: pathname === href ? 'red' : 'blue',
      }}
    >
      {label}
    </Link>
  )
  return (
    <nav>
      <span id="pathname">pathname: {pathname}</span>
      <br />
      {item('/', 'home')}
      {item('/slow', 'slow')}
      {item('/slow-with-loading', 'slowloading')}
    </nav>
  )
}
