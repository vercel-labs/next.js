import { VtProbe } from './vt-probe'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VtProbe />
        {children}
      </body>
    </html>
  )
}
