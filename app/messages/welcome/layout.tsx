export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				marginLeft: 'auto',
				marginRight: 'auto',
				maxWidth: '720px',
				padding: '1.5rem 1rem',
			}}
		>
			{children}
		</div>
	)
}
