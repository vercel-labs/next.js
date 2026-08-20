import SearchParamsButton from './SearchParamsButton';

export default function Page() {
  return (
    <main>
      <h1>URLSearchParams -&gt; Server Action</h1>
      <p>Expected: foo=bar&amp;next=js</p>
      <SearchParamsButton />
    </main>
  );
}
