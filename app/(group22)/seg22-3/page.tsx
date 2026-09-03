import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p22-3') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 22-3{m.suffix}</div> }
