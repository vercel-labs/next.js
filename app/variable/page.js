import { Inter } from 'next/font/google'
import Row from '../components/Row'
const font = Inter({ subsets: ['latin'] })
export default function Page() {
  return <Row label="variable" className={font.className} />
}
