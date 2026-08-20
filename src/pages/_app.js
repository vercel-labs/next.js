import 'src/styles/globals.css'
import { Suspense, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'

export default function App({ Component, pageProps }) {
  return (
    <NoSSR>
      <div>
        <Nav />
        <Suspense fallback={<div>Loading...</div>}>
          <Component {...pageProps} />
        </Suspense>
      </div>
    </NoSSR>
  )
}

const NoSSRFragment = ({ children }) => <>{children}</>
const NoSSR = dynamic(() => Promise.resolve(NoSSRFragment), { ssr: false })

const Nav = () => {
  return (
    <ul>
      <NavItem path="/">Home</NavItem>
      <NavItem path="/test-1">Test 1</NavItem>
      <NavItem path="/test-2">Test 2</NavItem>
    </ul>
  )
}

const NavItem = ({ children, path }) => {
  const router = useRouter()

  const selected = useMemo(
    () => path == "/" ? router.pathname == "/" : router.pathname.startsWith(path),
    [router, path],
  )

  return (
    <li>
      <Link
        href={path || '/'}
        className={`${selected ? 'text-blue-400' : ''}`}
      >
        {children}
      </Link>
    </li>
  )
}
