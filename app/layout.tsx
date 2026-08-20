import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <Link href="/">Home</Link>

          {Array.from(Array(10).keys()).map((i) => (
            <Link href={`/post/${i}`} key={i}>
              Post {i}
            </Link>
          ))}
        </nav>

        {children}
      </body>
    </html>
  );
}
