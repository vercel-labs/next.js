import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const { page } = await searchParams;
  const pageIndex = page !== undefined ? parseInt(page) : 1;
  return { title: `Page ${pageIndex}` };
}

export async function generateStaticParams() {
  return ["transfer-portal", "d2", "d3", "fcs", "fbs"].map((category) => ({ category }));
}

export default async function Page({ params, searchParams }: any) {
  const { category } = await params;
  const { page } = await searchParams;
  const pageIndex = page !== undefined ? parseInt(page) : 1;
  return <h1>{category} Page {pageIndex}</h1>;
}
