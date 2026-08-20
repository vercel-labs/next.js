import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const url = "/hair/shop-by-hair-type/dry-scalp";
  return (
    <div>
      <h1>home</h1>
      <Link id="link" href={url}>
        link to catch-all url
      </Link>
      <button id="push" onClick={() => router.push(url)}>
        router.push
      </button>
    </div>
  );
}
