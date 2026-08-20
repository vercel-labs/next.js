"use client";

export function ClientComponent({ myObject }) {
  return <pre>{JSON.stringify(myObject)}</pre>;
}
