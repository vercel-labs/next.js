import localFont from 'next/font/local'
const barFont = localFont({ src: '../fonts/font2.woff2' })
export default function Bar() {
  return <p className={barFont.className}>bar page local font</p>
}
