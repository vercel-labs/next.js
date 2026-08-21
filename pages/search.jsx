import Link from 'next/link';
import { useEffect, useState } from 'react';

export async function getServerSideProps() {
  // slow data source (e.g. Sitecore layout service)
  await new Promise((r) => setTimeout(r, 3000));
  return { props: { renderedAt: Date.now() } };
}

export default function Search({ renderedAt }) {
  const [results, setResults] = useState([]);
  useEffect(() => {
    fetch('/api/search?q=a').then((r) => r.json()).then((d) => setResults(d.results));
  }, []);
  return (
    <main>
      <h1 id="page-title">Search Page</h1>
      <p>rendered at {renderedAt}</p>
      <ul>
        {results.map((r) => (
          <li key={r}><Link id={`link-${r}`} href={`/detail/${r}`}>detail {r}</Link></li>
        ))}
      </ul>
    </main>
  );
}
