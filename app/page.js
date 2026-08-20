export default function Home() {
  return (<ul>
    <li><a href="/promo">/promo — inside (marketing) route group, NO error.js in group -&gt; root app/error.js should catch</a></li>
    <li><a href="/dashboard/panel">/dashboard/panel — inside (admin) group which HAS error.js -&gt; nearest boundary catches</a></li>
    <li><a href="/plain/throw">/plain/throw — no route group -&gt; root app/error.js catches</a></li>
  </ul>)
}
