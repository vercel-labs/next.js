import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p20-3') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 20-3{m.suffix}</div> }
