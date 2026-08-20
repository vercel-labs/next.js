import singleton from '../lib/singleton'
export default function Home() { return <div>home {singleton.value}</div> }
