import React, { ReactNode } from 'react'

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <body>
        <p>This is app/[lang] layout</p>
        {children}
      </body>
    </html>
  )
}
