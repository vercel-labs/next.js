export const revalidate = 1

export default function Page() {
  return <p data-generation={Date.now()}>home</p>
}
