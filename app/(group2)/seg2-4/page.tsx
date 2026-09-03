import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p2-4') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 2-4{m.suffix}</div> }
