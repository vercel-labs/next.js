export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return <p>Post {id}</p>;
}
