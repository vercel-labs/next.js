export const revalidate = 3600
export default async function Page() {
  return <p id="ts">{`A:${Date.now()}`}</p>
}
