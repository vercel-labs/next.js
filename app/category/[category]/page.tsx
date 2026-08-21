export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params; return <main>{category}</main>;
}
