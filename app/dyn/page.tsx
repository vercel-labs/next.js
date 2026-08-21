import { headers } from 'next/headers';

import { Heavy } from '../../components/Heavy';
import { Lazy } from '../../components/Lazy';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const h = await headers();
    return (
        <main>
            <p>ua: {h.get('user-agent')?.slice(0, 20)}</p>
            <Heavy />
            <Lazy />
        </main>
    );
}
