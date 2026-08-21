export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const res = await fetch("http://localhost:3000/api/meta", { cache: "no-store" });
  const data = await res.json();
  return { title: data.title as string };
}

export default function Page() {
  return <main>Home</main>;
}
