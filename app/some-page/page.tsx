export const revalidate = 3600;
export default function SomePage() {
  return (
    <main>
      <h1>Some Page</h1>
      <p id="ts">some-page rendered at: {new Date().toISOString()}</p>
    </main>
  );
}
