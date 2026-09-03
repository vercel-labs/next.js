import { makeMeta } from '../lib/meta'
export async function generateMetadata(){ return makeMeta('g33') }
export default function L({children}:{children:React.ReactNode}){return <section>{children}</section>}
