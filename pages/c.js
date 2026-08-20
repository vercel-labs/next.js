import dynamic from 'next/dynamic'
const E = dynamic(() => import('../components/EmphasisCss'))
export default function C() { return <E>page C (CSS Modules) — emphasis only (GREEN, 40px)</E> }
