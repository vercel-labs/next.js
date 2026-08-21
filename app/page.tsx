import Link from 'next/link';

export default function Page() {
  let photos = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <section className="cards-container">
      {photos.map((id) => (
        <Link className="card" key={id} href={`/photos/${id}`} passHref>
          {id}
        </Link>
      ))}
      <Link href="/redirectToModal">
        <strong>Open console and terminal and click me</strong>
        <br />
        Link to a page that redirects you to an intercepted page
      </Link>
    </section>
  );
}
