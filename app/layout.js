import Link from 'next/link'
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/" prefetch={true} id="link-home">Home</Link>{' | '}
          {[1, 2, 3].map((id) => (
            <span key={id}>
              <Link href={`/product/${id}`} prefetch={true} id={`link-p${id}`}>
                Product {id}
              </Link>{' | '}
            </span>
          ))}
        </nav>
        {children}
      </body>
    </html>
  )
}
