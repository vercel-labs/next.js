"use client";

import { useState } from "react";

export const Button = () => {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => {
        setCount((val) => val + 1);
      }}
    >
      You clicked me {count} times
    </button>
  );
};
