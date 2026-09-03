import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p21-2') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 21-2{m.suffix}</div> }
