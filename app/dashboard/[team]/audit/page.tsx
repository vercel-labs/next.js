export default async function PhotoPage({
  params,
  searchParams,
}: {
  params: Promise<{ team: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const team = (await params).team;
  const photoId = (await searchParams).photoId;
  return (
    <div>
      Audit page filtered with photoId={photoId} (Team: {team})
    </div>
  );
}
