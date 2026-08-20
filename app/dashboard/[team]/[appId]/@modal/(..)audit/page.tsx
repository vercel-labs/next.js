import { Modal } from "./modal";

export default async function PhotoModalPage({
  params,
  searchParams,
}: {
  params: Promise<{ team: string }>;
  searchParams: Promise<{ photoId?: string[] }>;
}) {
  const team = (await params).team;
  const photoId = (await searchParams).photoId;
  return (
    <Modal>
      Audit modal filtered with photoId={photoId} (Team: {team})
    </Modal>
  );
}
