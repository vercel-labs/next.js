import Link from 'next/link';
export default function L({children}:{children:React.ReactNode}){return <div><nav><Link id="l1" href="/c/us">us</Link> <Link id="l2" href="/c/us/ca">ca</Link> <Link id="l3" href="/c/us/ca/sf">sf</Link></nav>{children}</div>;}
