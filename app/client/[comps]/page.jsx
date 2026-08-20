// baseline: dynamic() used inside a Client Component wrapper -> correct splitting
import DynComponentA from '../../DynComponentA'
import DynComponentB from '../../DynComponentB'

export default async function Page({ params }) {
	const { comps } = await params
	return (
		<div>
			{comps.includes('a') ? <DynComponentA /> : null}
			{comps.includes('b') ? <DynComponentB /> : null}
		</div>
	)
}
