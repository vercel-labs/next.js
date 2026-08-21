import Link from 'next/link'

export default function Page() {
	return (
		<main>
			<h1>MDX Warning Reproduction</h1>
			<p>
				This is a minimal Next.js App Router project configured with MDX via <code>@next/mdx</code>.
			</p>
			<p>
				Visit the MDX page at <Link href='/messages/welcome'>/messages/welcome</Link>.
			</p>
		</main>
	)
}
