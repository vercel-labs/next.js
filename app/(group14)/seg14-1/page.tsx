import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p14-1') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 14-1{m.suffix}</div> }
