import dynamic from 'next/dynamic'
import { base } from '../styles/base.css'
const Emphasis = dynamic(() => import('../components/Emphasis'))
export default function B() {
  return <Emphasis extra={base}>page B — base + emphasis (expect GREEN, 40px)</Emphasis>
}
