'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function TestImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      id="wrapper"
      style={{
        position: 'relative',
        width: 400,
        height: 300,
        background: loaded ? 'transparent' : 'red',
      }}
    >
      <Image
        id="test-image"
        src="/test.png"
        alt="test"
        width={400}
        height={300}
        unoptimized
        priority
        data-loaded={loaded ? 'true' : 'false'}
        style={{ opacity: loaded ? 1 : 0.25 }}
        onLoad={() => {
          // Record when next/image *reports* the load.
          window.__onLoadAt = performance.now();
          setLoaded(true);
        }}
      />
    </div>
  );
}
