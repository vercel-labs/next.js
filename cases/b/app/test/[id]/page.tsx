// Case B: generateStaticParams returns an empty array
export function generateStaticParams() {
  return [] as { id: string }[];
}
export default async function Page(props: any) {
  return <div>{JSON.stringify(await props.params)}</div>;
}
