import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Async generateMetadata: metadata is streamed, so `link rel="canonical"`
// is NOT part of the initial HTML shell that crawlers may read.
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { variant } = await searchParams;
  await new Promise((r) => setTimeout(r, 1000)); // simulated API call

  return {
    title: variant ? `Widget (${variant})` : "Widget",
    alternates: {
      // canonical intentionally drops query params
      canonical: `/p/${slug}`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { variant } = await searchParams;
  return (
    <main>
      <h1>{slug}</h1>
      <p>variant: {String(variant ?? "none")}</p>
    </main>
  );
}
