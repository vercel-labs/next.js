import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          id="inline-before-interactive"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__inlineBeforeInteractiveMarker__ = 'inline_before_interactive_marker'`,
          }}
        />
      </body>
    </html>
  )
}
