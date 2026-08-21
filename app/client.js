'use client';

import { useTransition } from 'react';
import { throwingAction } from './actions';

export default function Client() {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <button
        id="direct"
        onClick={async () => {
          await throwingAction();
        }}
      >
        call action directly in onClick
      </button>
      <button
        id="transition"
        onClick={() => {
          startTransition(async () => {
            await throwingAction();
          });
        }}
      >
        call action inside startTransition
      </button>
      <p id="pending">{isPending ? 'pending' : 'idle'}</p>
    </div>
  );
}
