import { Document, VectorStoreIndex } from 'llamaindex';
export async function GET() {
  const doc = new Document({ text: 'hello world' });
  return Response.json({ ok: true, id: doc.id_, has: typeof VectorStoreIndex });
}
