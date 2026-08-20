import Link from "next/link";

export default async function AppPage(props: {
  params: Promise<{ team: string; appId: string }>;
}) {
  const { team, appId } = await props.params;
  let photos = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div>
      App page (Team: {team} | App: {appId})
      <section className="cards-container">
        {photos.map((id) => (
          <Link
            className="card"
            key={id}
            href={`/dashboard/${team}/audit?photoId=${id}`}
          >
            {id}
          </Link>
        ))}
      </section>
    </div>
  );
}
