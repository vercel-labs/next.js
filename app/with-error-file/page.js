import BadComponent from '../components/bad-server-component';

export default function Page() {
  return (
    <main>
      <h1 id="heading">error.js segment boundary + throwing Server Component</h1>
      <BadComponent />
    </main>
  );
}
