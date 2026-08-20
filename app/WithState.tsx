"use client";
import { useState } from "react";

export const WithState = () => {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      {counter}
      <button onClick={() => setCounter((c) => c + 1)}>Increase</button>
    </div>
  );
};
