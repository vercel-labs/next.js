import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function LangLayout({ children, params }) {
  const { lang } = await params
  const cookieStore = await cookies()
  const mode = cookieStore.get('theme-mode')?.value ?? 'system'
  return (
    <html lang={lang} data-mode={mode}>
      <body>
        <p id="mode">mode: {mode}</p>
        <nav>
          <Link href={`/${lang}`}>home</Link>{' '}
          <Link href={`/${lang}/other`}>other</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
