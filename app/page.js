import { BrokenModel, getModelName } from '../lib/model';

export const dynamic = 'force-dynamic';

export default function Page() {
  const name = getModelName(BrokenModel);
  console.log('[repro] class name at runtime:', name);
  return <pre id="name">class name: {name}</pre>;
}
