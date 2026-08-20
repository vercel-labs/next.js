'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
function Inner(){ const sp=useSearchParams(); return <p id="sp">q={sp.toString()}</p>; }
export default function Login(){
  return (<div><h1 id="login">Login page</h1>
    <Suspense fallback={<p>loading</p>}><Inner/></Suspense>
    <Link id="l-same-other" href="/login/?firstVisit=false">same other q</Link>{' '}
    <Link id="l-other-q" href="/other/?x=1">other q</Link>{' '}
    <Link id="l-other" href="/other/">other</Link>
  </div>);
}
