export default async function InterceptedPhoto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div id="modal">MODAL intercepted photo {id}</div>;
}
