import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p19-5') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 19-5{m.suffix}</div> }
