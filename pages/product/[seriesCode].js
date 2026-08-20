import Link from "next/link";
import { useRouter } from "next/router";

export default function Product() {
  const router = useRouter();
  const { seriesCode, Page } = router.query;
  return (
    <div>
      <h1 id="series">seriesCode: {String(seriesCode)}</h1>
      <p id="page">Page: {String(Page)}</p>
      <p id="query">query: {JSON.stringify(router.query)}</p>
      <Link href="/product/5678/?Page=2" id="l5678">go 5678</Link>
    </div>
  );
}
