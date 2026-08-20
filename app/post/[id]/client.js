'use client';
import { Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
function Inner(){ const sp=useSearchParams(); return <p id="sp">a={String(sp.get('a'))}</p>; }
export default function PostClient(){
  const { id } = useParams();
  const router = useRouter();
  return (<div>
    <h1 id="post">Post {id}</h1>
    <Suspense fallback={<p>loading</p>}><Inner/></Suspense>
    <button id="push-post2q" onClick={()=>router.push('/post/2/?a=2')}>post/2?a=2</button>
    <button id="push-post2" onClick={()=>router.push('/post/2/')}>post/2</button>
    <button id="push-loginq" onClick={()=>router.push('/login/?firstVisit=true')}>login?firstVisit=true</button>
  </div>);
}
