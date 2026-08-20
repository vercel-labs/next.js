import dynamic from 'next/dynamic'
import s from '../styles/base.module.css'
const E = dynamic(() => import('../components/EmphasisCss'))
export default function D() { return <E extra={s.base}>page D (CSS Modules) — base + emphasis (expect GREEN, 40px)</E> }
