export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page: string | undefined }>;
}) {
  const { page } = await searchParams;
  console.log("this is run");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const beers = [
    { id: "1", name: `Buzz (page ${page ?? 1})` },
    { id: "2", name: "Trashy Blonde" },
  ];
  return (
    <ul>
      {beers.map((beer) => (
        <li key={beer.id}>{beer.name}</li>
      ))}
    </ul>
  );
}
