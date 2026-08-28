import { Providers } from '../components/providers'
export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
