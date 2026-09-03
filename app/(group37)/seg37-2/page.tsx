import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p37-2') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 37-2{m.suffix}</div> }
