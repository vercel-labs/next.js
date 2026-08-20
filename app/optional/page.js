import { Inter } from 'next/font/google'
import Row from '../components/Row'
const font = Inter({ subsets: ['latin'], display: 'optional' })
export default function Page() {
  return <Row label="optional" className={font.className} />
}
