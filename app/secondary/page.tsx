import Link from "next/link";

export default function SecondaryPage() {
  return <main className="main-content"><p className="eyebrow">Prefetch target</p><h1>Secondary route</h1><p className="lede">This route gives the preview app a real Link for partial prefetching to observe.</p><Link href="/">Back home</Link></main>;
}
