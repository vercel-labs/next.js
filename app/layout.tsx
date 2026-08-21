import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'MDX Warning Reproduction',
	description: 'Minimal Next.js App Router + MDX reproduction for webpack cache warning.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props

	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	)
}
