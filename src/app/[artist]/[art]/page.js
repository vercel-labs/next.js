export default async function ArtPage({ params }) {
  await new Promise((r) => setTimeout(r, 3000));
  return <p id="art-content">Art: {params.art} by {params.artist}</p>;
}
