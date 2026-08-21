"use client";
import { useEffect } from "react";
export function Log({ name }) {
  console.log(`[${name}] render`, Date.now());
  useEffect(() => {
    console.log(`[${name}] mount`, Date.now());
    return () => console.log(`[${name}] unmount`, Date.now());
  }, []);
  return <div>{name}</div>;
}
