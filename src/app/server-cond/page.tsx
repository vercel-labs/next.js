import dynamic from 'next/dynamic';
const WrapperA = dynamic(() => import(/* webpackChunkName: "WrapperA" */ '../../components/WrapperA'));
const WrapperB = dynamic(() => import(/* webpackChunkName: "WrapperB" */ '../../components/WrapperB'));
export default async function Page() {
  if (true) { return <WrapperA />; } else { return <WrapperB />; }
}
