'use client';

import { useMemo } from 'react';

export default function TestComponent() {
  const memoizedContent = useMemo(() => {
    return (
      <div>
        <p>Content from useMemo</p>
      </div>
    );
  }, []);

  // Early return causes parser to think we're still in JSX context
  if (false) {
    return <div>Mobile version</div>;
  }

  return (
    <div>
      {true ? (
        <div>Loading state</div>
      ) : (
        memoizedContent
      )}
    </div>
  );
}
