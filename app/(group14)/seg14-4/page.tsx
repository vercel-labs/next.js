import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p14-4') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 14-4{m.suffix}</div> }
