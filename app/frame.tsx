"use client";

import * as React from "react";

export function Frame({ title, src }: { title: string; src: string }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div>
      <p data-testid="status">
        {title} loaded: {loaded ? "true" : "false"}
      </p>
      <iframe
        src={src}
        title={title}
        onLoad={() => {
          console.log(`frame ${title} has loaded`);
          setLoaded(true);
        }}
      />
    </div>
  );
}
