'use client';
export default function Error({ error }) {
  return <p id="segment-fallback">error.js caught: {error.message}</p>;
}
