export const dynamicParams = false;
export const revalidate = 10;

export function generateStaticParams() {
  return [{ slug: "should-work" }];
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <div>slug: {slug} time: {Date.now()}</div>;
}
