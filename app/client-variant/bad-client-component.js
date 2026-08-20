'use client';
export default function BadClientComponent() {
  throw new Error('boom from client component');
}
