import BreadcrumbsProvider from '../components/provider'
export default function RootLayout({ breadcrumbs, children }) {
  return (
    <html lang="en">
      <body>
        <BreadcrumbsProvider breadcrumbs={breadcrumbs}>
          <main>{children}</main>
        </BreadcrumbsProvider>
      </body>
    </html>
  )
}
