import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p7-3') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 7-3{m.suffix}</div> }
