import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p2-3') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 2-3{m.suffix}</div> }
