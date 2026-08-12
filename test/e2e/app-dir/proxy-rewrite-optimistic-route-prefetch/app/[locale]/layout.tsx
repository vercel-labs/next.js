export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }]
}

export default function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
