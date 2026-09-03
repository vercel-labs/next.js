import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p30-1') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 30-1{m.suffix}</div> }
