'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { saveEvent } from '../../actions';

export function EditForm({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounced auto-save (same shape as the report: 2s debounce)
  function onChange(next: string) {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveEvent(slug, next);
    }, 2000);
  }

  return (
    <div>
      <h2>Edit {slug}</h2>
      <input
        data-testid="name-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {/* clicking the backdrop closes the drawer and navigates back to the list */}
      <button data-testid="backdrop" onClick={() => router.push('/events')}>
        close (backdrop)
      </button>
    </div>
  );
}
