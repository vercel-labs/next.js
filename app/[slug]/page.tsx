export async function generateStaticParams() {
  return [{ slug: "known" }];
}

export const dynamicParams = false;

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams; // <-- makes the route dynamic
  return (
    <h1>
      {slug} {JSON.stringify(sp)}
    </h1>
  );
}
