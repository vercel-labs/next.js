export default async function Lazy() {
  await new Promise((r) => setTimeout(r, 5000))
  return <div id="lazy">Lazy resolved</div>
}
