import './globals.css'
import { Inter } from 'next/font/google'
import Probe from './probe'
const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Probe />
        {children}
      </body>
    </html>
  )
}
