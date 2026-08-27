import Sentinel from './sentinel'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sentinel />
        {children}
      </body>
    </html>
  )
}
