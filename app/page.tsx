import pLimit from 'p-limit';

export default async function Page() {
  const limit = pLimit(1);
  const result = await limit(() => Promise.resolve('p-limit works'));
  return <main>{result}</main>;
}
