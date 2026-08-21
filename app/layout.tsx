import { Montserrat_Underline } from 'next/font/google'

const font = Montserrat_Underline({ subsets: ['latin'], weight: '400' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
