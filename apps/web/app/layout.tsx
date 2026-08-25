import '@repo/ui'
import { getDictionary } from '@repo/i18n'
import { SITE, NAV_ITEMS } from '@repo/config'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dict = getDictionary('en')
  return (
    <html lang="en">
      <body>
        <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eaeaea' }}>
          <strong>{SITE.name}</strong>
          {NAV_ITEMS.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>{children}</main>
      </body>
    </html>
  )
}