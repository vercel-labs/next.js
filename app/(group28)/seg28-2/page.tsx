import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p28-2') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 28-2{m.suffix}</div> }
