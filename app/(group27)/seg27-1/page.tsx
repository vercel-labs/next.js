import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p27-1') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 27-1{m.suffix}</div> }
