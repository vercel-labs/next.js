import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ul>
          <li>
            <Link id="home" href={'/'}>
              Home
            </Link>
          </li>
          <li>
            <Link id="about" href={'/about'}>
              About
            </Link>
          </li>
        </ul>
        {children}
      </body>
    </html>
  )
}
