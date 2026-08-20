"use client";

import { useEffect, useState } from "react";

// Reporter's component from vercel/next.js#66210.
// In StrictMode dev, the mount effect should run twice (so "Create Story"
// would be appended twice and "effect" logged twice).
export function StoryTray({ stories }) {
  const [list, setList] = useState(stories);

  useEffect(() => {
    console.log("effect");
    setList((prev) => [...prev, { id: "create", label: "Create Story" }]);
  }, []);

  return (
    <ul>
      {list.map((story) => (
        <li key={story.id}>{story.label}</li>
      ))}
    </ul>
  );
}
