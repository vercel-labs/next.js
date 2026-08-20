export const dynamicParams = false

export function generateStaticParams() {
  return [{ locale: 'en' }]
}

export default function LocaleLayout({ children, params }) {
  return <div id="locale-layout">{children}</div>
}
