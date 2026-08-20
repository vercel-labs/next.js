import { Inter } from 'next/font/google'
import Row from '../components/Row'
const font = Inter({ subsets: ['latin'], weight: '400' })
export default function Page() {
  return <Row label="weight400" className={font.className} />
}
