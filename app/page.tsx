export default function Home() {
  return (
    <form method="post" action="/post-page">
      <input type="hidden" name="email" defaultValue="user@example.com" />
      <button type="submit">POST to /post-page</button>
    </form>
  );
}
