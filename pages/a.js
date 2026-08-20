import dynamic from 'next/dynamic'
const Emphasis = dynamic(() => import('../components/Emphasis'))
export default function A() {
  return <Emphasis>page A — emphasis only (GREEN, 40px)</Emphasis>
}
