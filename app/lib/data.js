export async function getData() {
  const res = await fetch('http://localhost:8088/test', { cache: 'no-store' });
  return res.json();
}
// touch
