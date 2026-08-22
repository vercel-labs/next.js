import { state } from '../counter';
import { Client } from './client';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return <Client value={state.counter} />;
}
