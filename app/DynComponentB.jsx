'use client'

import dynamic from 'next/dynamic'

const ClientComponentB = dynamic(() => import('./ClientComponentB'))

export default function DynComponentB() {
	return <ClientComponentB />
}
