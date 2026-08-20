import { IBM_Plex_Mono } from 'next/font/google'
const font = IBM_Plex_Mono({ subsets: ['latin'], weight: '400' })
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
