import Link from "next/link";

export default function Page() {
  let teams = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <section className="cards-container">
      {teams.map((id) => (
        <Link className="card" key={id} href={`/dashboard/${id}`} passHref>
          Go to team: {id}
        </Link>
      ))}
    </section>
  );
}
