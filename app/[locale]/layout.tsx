import Link from 'next/link'

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/en/pages/page-a">Page A</Link>{' '}
          <Link href="/en/pages/page-x">Page X (should 404)</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

export const dynamicParams = false
