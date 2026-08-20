export default async function CommandModal({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  return (
    <div id="modal">MODAL command palette q={String(sp.q ?? "")}</div>
  );
}
