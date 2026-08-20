"use client"

import { useEffect, useState } from "react";

export default function Example() {
  const [examples, setExamples] = useState(["h", "e", "l", "o"]);

  useEffect(() => {
    async function asyncExamples() {
      const newExamples = [];
      for (const example of examples) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        newExamples.push(example);
      }

      setExamples(newExamples);
    }
    asyncExamples();
  }, []);

  return (
    <ul>
      {examples.map((val) => (
        <li key={val}>{val}</li>
      ))}
    </ul>
  );
}
