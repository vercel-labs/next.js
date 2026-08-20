import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link id="home-link" href="/">Home</Link>{' '}
          <Link id="about-link" href="/about">About</Link>
        </nav>
        <main>{children}</main>
        <p id="active">activeElement: <span id="ae" /></p>
        <script
          dangerouslySetInnerHTML={{
            __html: `setInterval(function(){var e=document.activeElement;document.getElementById('ae').textContent=(e?e.tagName+'#'+(e.id||'')+' '+(e.textContent||'').trim().slice(0,20):'none')},200)`,
          }}
        />
      </body>
    </html>
  )
}
