export default async function Page() {
  await new Promise((r) => setTimeout(r, 3000));
  return <p id="dashboard-children">dashboard children content {Date.now()}</p>;
}
