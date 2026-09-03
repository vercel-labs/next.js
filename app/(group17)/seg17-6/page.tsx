import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p17-6') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 17-6{m.suffix}</div> }
