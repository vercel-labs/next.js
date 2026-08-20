import dynamic from 'next/dynamic'

// dynamic() of Server Components, per docs the *client* children should be lazy chunks
const ServerComponentA = dynamic(() => import('../../ServerComponentA'))
const ServerComponentB = dynamic(() => import('../../ServerComponentB'))

export default async function Page({ params }) {
	const { comps } = await params
	return (
		<div>
			{comps.includes('a') ? <ServerComponentA /> : null}
			{comps.includes('b') ? <ServerComponentB /> : null}
		</div>
	)
}
