export const revalidate = 1;
export const dynamic = "force-static";

export default async function Page() {
  return <div>ok {Date.now()}</div>;
}
