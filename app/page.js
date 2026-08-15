'use client';
import { useState } from 'react';
export default function Page(){
  const [r,setR]=useState('');
  return <main><button onClick={()=>{ const w = new Worker(new URL('../modules/w1.js', import.meta.url)); w.postMessage('hi'); setR('started'); }}>go</button><p>{r}</p></main>;
}
