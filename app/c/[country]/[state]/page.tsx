import Link from 'next/link';
export default async function P(){ await new Promise(r=>setTimeout(r,2000)); return <div data-page="state" id="page-state">PAGE state<Link id="l1" href="/c/us">us</Link> <Link id="l2" href="/c/us/ca">ca</Link> <Link id="l3" href="/c/us/ca/sf">sf</Link></div>;}
