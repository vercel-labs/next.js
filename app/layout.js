import localFont from 'next/font/local'

const inter = localFont({
  src: [
    {
      path: '../public/fonts/inter-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      // This should never get preloaded (browsers without woff2 support don't preload)
      path: '../public/fonts/inter-latin-400-normal.woff',
      weight: '400',
      style: 'normal',
    },
  ],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
