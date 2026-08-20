export const revalidate = 3600;
export default function Nested() {
  return (
    <main>
      <h1>Some Page</h1>
      <p id="ts">nested rendered at: {new Date().toISOString()}</p>
    </main>
  );
}
