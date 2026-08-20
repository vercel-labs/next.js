import { headers } from 'next/headers'

function code() {
  window.__theme = 'dark'
}

export default function RootLayout({ children }) {
  const nonce = headers().get('x-nonce') ?? undefined
  return (
    <html lang="en">
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `(${code})();` }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
