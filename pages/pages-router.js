export default function PagesRouter() {
  return (
    <div>
      <h1>Pages Router with plain img</h1>
      <img src="/next.svg" width="200" height="100" alt="plain img" />
      <img src="/lazy.svg" width="200" height="100" alt="lazy img" loading="lazy" />
    </div>
  );
}
