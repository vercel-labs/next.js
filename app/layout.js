import Script from 'next/script'

export const metadata = { title: 'inline script head repro' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script id="google-analytics-inline">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');`}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
      </head>
      <body>{children}</body>
    </html>
  )
}
