// Control variant: same route WITHOUT reading searchParams, so the route is
// classified static (● /known). Copy over app/[slug]/page.tsx to test it.
export async function generateStaticParams() {
  return [{ slug: "known" }];
}

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
