import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p39-0') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 39-0{m.suffix}</div> }
