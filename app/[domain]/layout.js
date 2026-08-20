export const dynamic = 'force-static'

export default async function Layout({ params, children }) {
  const { domain: domainName } = await params
  return (
    <html>
      <head></head>
      <body>
        <div>Domain: {domainName}</div>
        <main>{children}</main>
      </body>
    </html>
  )
}
