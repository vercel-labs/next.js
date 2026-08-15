export const metadata = { title: 'Secret Terminal', description: 'repro' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Secret Terminal" />
      </head>
      <body>{children}</body>
    </html>
  )
}
