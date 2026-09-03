import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p12-1') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 12-1{m.suffix}</div> }
