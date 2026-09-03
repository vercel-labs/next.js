import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p9-5') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 9-5{m.suffix}</div> }
