'use client';

import { useState } from 'react';

export function Heavy() {
    const [n, setN] = useState(0);
    return <button onClick={() => setN(n + 1)}>heavy {n}</button>;
}
