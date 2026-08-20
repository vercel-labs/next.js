// Case C: generateStaticParams genuinely absent
export default async function Page(props: any) {
  return <div>{JSON.stringify(await props.params)}</div>;
}
