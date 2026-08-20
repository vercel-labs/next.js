import { db } from '../db/connect';
import { dbGlobal } from '../db/connect-global';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main>
      <p id="plain">{`plain connection id: ${db.id}`}</p>
      <p id="global">{`globalThis connection id: ${dbGlobal.id}`}</p>
    </main>
  );
}
