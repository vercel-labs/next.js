export default function Home() {
  const send = (mb) => {
    const body = 'A'.repeat(mb * 1024 * 1024);
    fetch('/api/upload', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
      .then((r) => r.json())
      .then(console.log);
  };
  return (
    <main>
      <button onClick={() => send(1)}>POST 1 MB</button>
      <button onClick={() => send(400)}>POST 400 MB</button>
    </main>
  );
}
