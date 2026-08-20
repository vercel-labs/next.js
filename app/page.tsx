async function getData() {
  return { items: ['a', 'b'] };
}

export async function Child() {
  const data = await getData();
  return <pre>child:{data.items.join(',')}</pre>;
}

export default async function Page() {
  const data = await getData();
  return (
    <>
      <h1>{data.items.length} Items</h1>
      <Child />
    </>
  );
}
