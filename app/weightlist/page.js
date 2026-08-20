import { Inter } from 'next/font/google'
import Row from '../components/Row'
const font = Inter({ subsets: ['latin'], weight: ['400', '600', '900'] })
export default function Page() {
  return <Row label="weightlist" className={font.className} />
}
