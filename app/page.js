import dynamic from 'next/dynamic'

export default async function Home() {
  const Stuff = dynamic(() => import('./stuff.mdx'))
  return (<div><Stuff /></div>)
}
