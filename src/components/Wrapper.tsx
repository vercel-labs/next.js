'use client';
import dynamic from 'next/dynamic';
const ClientA = dynamic(() => import(/* webpackChunkName: "ClientA" */ './ClientA'));
const ClientB = dynamic(() => import(/* webpackChunkName: "ClientB" */ './ClientB'));
export default function Wrapper() {
  const condition = true;
  return condition ? <ClientA /> : <ClientB />;
}
