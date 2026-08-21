export default async function Page() {
  await new Promise((r) => setTimeout(r, 3000));
  return <p id="users-content">users slot content {Date.now()}</p>;
}
