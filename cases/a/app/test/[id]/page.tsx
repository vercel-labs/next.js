// Case A: reporter's original code - generateStaticParams returns strings, not objects
export function generateStaticParams() {
  return ['test'] as any;
}
export default async function Page(props: any) {
  return <div>{JSON.stringify(await props.params)}</div>;
}
