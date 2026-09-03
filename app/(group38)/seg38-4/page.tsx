import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p38-4') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 38-4{m.suffix}</div> }
