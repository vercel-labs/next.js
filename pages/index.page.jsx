export default function Home() {
  return (
    <div>
      {/* /about IS a real page (pages/about.page.jsx) -> should be reported, but is NOT */}
      <a href="/about">About</a>
      {/* /about.page is NOT a route -> should not be reported (currently also not reported) */}
      <a href="/about.page">About.page</a>
    </div>
  )
}
