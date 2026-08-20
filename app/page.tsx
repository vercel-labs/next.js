export const revalidate = 3600;
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p id="ts">home rendered at: {new Date().toISOString()}</p>
      <a href="/some-page/">Go to some page</a>
    </main>
  );
}
