'use client';
import { useState } from 'react';
export default function Page(){
  const [r,setR]=useState('');
  return <main><button onClick={async()=>{const m=await import('../modules/entry'); setR(await m.run());}}>{r}go</button></main>;
}
