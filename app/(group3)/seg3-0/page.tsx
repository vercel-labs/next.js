import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p3-0') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 3-0{m.suffix}</div> }
