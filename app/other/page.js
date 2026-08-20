'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
function Inner(){ const sp=useSearchParams(); return <p id="sp">q={sp.toString()}</p>; }
export default function Other(){ return (<div><h1 id="other">Other page</h1>
  <Suspense fallback={<p>loading</p>}><Inner/></Suspense>
  <Link id="l-login-q" href="/login/?firstVisit=true">login q</Link>{' '}
  <Link id="l-login-q2" href="/login/?firstVisit=maybe">login q2</Link>{' '}
  <Link id="l-login" href="/login/">login</Link></div>); }
