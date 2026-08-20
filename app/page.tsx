export const dynamic = 'force-dynamic'
export default function Home() {
  return (
    <ul>
      <li><a href="/time/">/time/</a></li>
      <li><a href="/blog/prebuilt/">/blog/prebuilt/ (built at build time)</a></li>
      <li><a href="/blog/runtime/">/blog/runtime/ (built on demand)</a></li>
      <li><a href="/api/revalidate/?path=/time/">/api/revalidate/?path=&lt;path&gt;</a></li>
    </ul>
  )
}
