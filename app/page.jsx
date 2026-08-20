export default function Home() {
  return (
    <ul>
      <li>
        <a href="/gsp/anything">/gsp/anything (generateStaticParams + dynamicParams)</a>
      </li>
      <li>
        <a href="/nogsp/anything">/nogsp/anything (no generateStaticParams)</a>
      </li>
    </ul>
  )
}
