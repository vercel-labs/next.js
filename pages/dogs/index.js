import Link from 'next/link'
export default function DogsPage({ dogs, stamp }) {
  return (
    <>
      <h1>Dog breeds</h1>
      <p id="stamp">stamp: {String(stamp)}</p>
      <p id="props-status">{dogs === undefined ? 'PROPS_MISSING' : 'PROPS_OK'}</p>
      <ul>
        {(dogs || []).map((d) => (
          <li key={d.id}>
            <Link id={`link-${d.id}`} href={`/hunder/${d.id}`}>{d.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
export async function getStaticProps() {
  return {
    props: {
      dogs: [{ id: 'akita', name: 'Akita' }, { id: 'beagle', name: 'Beagle' }],
      stamp: Date.now(),
    },
    revalidate: 3600,
  }
}
