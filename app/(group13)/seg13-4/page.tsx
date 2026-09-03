import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p13-4') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 13-4{m.suffix}</div> }
