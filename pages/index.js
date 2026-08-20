import Link from 'next/link'
import localFont from 'next/font/local'
const myFont = localFont({ src: '../fonts/font.woff2', variable: '--f1' })
export default function Home() {
  return (
    <div>
      <p className={myFont.className}>hello local font (home)</p>
      <Link href="/bar">go to /bar</Link>
    </div>
  )
}
