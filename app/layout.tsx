import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = localFont({
  src: '../SpaceGroteskTrimmed.woff2',
  display: 'block',
  preload: true,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
