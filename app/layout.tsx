import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-N8ZG435" />
      <GoogleAnalytics gaId="G-ABCDE12345" />
      <body>{children}</body>
    </html>
  )
}
