import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p8-1') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 8-1{m.suffix}</div> }
