import { Modal } from './modal';

export default function PhotoModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  console.log(`Rendering PhotoModal at ${new Date().toISOString()}`);
  return <Modal>{photoId}</Modal>;
}
