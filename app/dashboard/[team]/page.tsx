import Link from "next/link";

export default async function Page(props: {
  params: Promise<{ team: string }>;
}) {
  const { team } = await props.params;
  let apps = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <section className="cards-container">
      {apps.map((id) => (
        <Link className="card" key={id} href={`/dashboard/${team}/${id}`}>
          Go to app: {id}
        </Link>
      ))}
    </section>
  );
}
