'use client';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function PhotoModal({ params }) {
  const { id } = use(params);
  const router = useRouter();
  return (
    <div id="modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', color: 'white' }}>
      <p>Modal photo {id}</p>
      <button id="close-replace" onClick={() => router.replace('/')}>X (replace)</button>
      <button id="close-push" onClick={() => router.push('/')}>X (push)</button>
      <button id="close-back" onClick={() => router.back()}>X (back)</button>
    </div>
  );
}
