import Link from "next/link";

export const dynamicParams = false;

export function generateStaticParams() {
  let slugs = ["1", "2", "3", "4", "5", "6"];
  return slugs.map((slug) => ({ id: slug }));
}

export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  return (
    <div>
      <div className="card">{id}</div>
      <Link href={"/"}>Home</Link>
    </div>
  );
}
