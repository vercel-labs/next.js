import { makeMeta } from '../lib/meta'
export async function generateMetadata(){ return makeMeta('g20') }
export default function L({children}:{children:React.ReactNode}){return <section>{children}</section>}
