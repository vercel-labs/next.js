import singleton from '../../lib/singleton'
export const dynamic = 'force-dynamic'
export default function Dynamic() { return <div>dynamic {singleton.value}</div> }
