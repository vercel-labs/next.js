import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p18-5') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page 18-5{m.suffix}</div> }
