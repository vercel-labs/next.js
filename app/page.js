export default function Home() {
  return (<ul>
    <li><a href="/blog/some-slug">/blog/some-slug (on-demand, expect {"{\"doesnt-work\":\"some-slug\"}"})</a></li>
    <li><a href="/blog/pregenerated">/blog/pregenerated (prerendered)</a></li>
  </ul>);
}
