import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p31-3') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 31-3{m.suffix}</div> }
