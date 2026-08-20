import Script from 'next/script'
import { locale } from 'next/root-params'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fi' }]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await locale()
  return (
    <html lang={lang}>
      <body>
        <Script id="before-i" src="/bi.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}
