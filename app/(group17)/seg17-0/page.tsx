import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p17-0') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 17-0{m.suffix}</div> }
