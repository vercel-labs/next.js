export default async function Page() {
  const now = new Date().toISOString(); // <- set a breakpoint on this line
  return <main>server rendered at {now}</main>;
}
