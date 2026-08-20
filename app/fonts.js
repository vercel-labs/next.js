import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Inter served by Google Fonts through next/font/google
export const googleInter = Inter({ subsets: ['latin'], display: 'swap' })

// The same font, official build from rsms/inter (npm: inter-ui), used locally
export const localInter = localFont({
  src: './InterVariable.woff2',
  display: 'swap',
})
