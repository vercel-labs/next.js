'use client'

import dynamic from 'next/dynamic'

const ClientComponentA = dynamic(() => import('./ClientComponentA'))

export default function DynComponentA() {
	return <ClientComponentA />
}
