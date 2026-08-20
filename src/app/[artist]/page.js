export default async function ArtistPage({ params }) {
  await new Promise((r) => setTimeout(r, 3000));
  return <p>Artist: {params.artist}</p>;
}
