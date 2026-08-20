import { getEvent } from '../../../lib/store';
import { EditForm } from './edit-form';

export const dynamic = 'force-dynamic';

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return <p>not found</p>;
  return <EditForm slug={event.slug} name={event.name} />;
}
