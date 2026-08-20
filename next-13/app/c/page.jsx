export default async function PageC() {
  await new Promise((r) => setTimeout(r, 50));
  return <p>c</p>;
}
