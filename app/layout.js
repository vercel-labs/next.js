import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script id="before-interactive" strategy="beforeInteractive">
          {`console.log("I should be beforeInteractive")`}
        </Script>
        <Script id="after-interactive" strategy="afterInteractive">
          {`console.log("I am afterInteractive")`}
        </Script>
        <Script id="root-layout-inline" strategy="afterInteractive">
          {`console.log("Im in root layout!")`}
        </Script>
        {children}
      </body>
    </html>
  )
}
