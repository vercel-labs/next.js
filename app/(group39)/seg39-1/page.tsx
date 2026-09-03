import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p39-1') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 39-1{m.suffix}</div> }
