import dynamic from 'next/dynamic';

const Block1 = dynamic(() => import('./Block1'));

export default async function BlockList() {
  'use cache';
  return <Block1 />;
}
