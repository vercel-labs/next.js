export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }) {
  const { slugs } = await params;
  await new Promise((r) => setTimeout(r, 1500));
  return (
    <div>
      <h1 id="publication">control {slugs.join('/')}</h1>
    </div>
  );
}
