import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: [`latin`],
  display: `swap`,
  variable: `--font-inter`,
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
