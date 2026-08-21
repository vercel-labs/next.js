'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    const hasDocument = typeof document === 'object';
    const container = hasDocument
      ? document.getElementById('modal-root')
      : null;
    if (container) {
      return createPortal(
        <div className='fixed inset-0 flex items-center justify-center z-50 col-span-full'>
          <div className='bg-white p-4 rounded-lg w-full max-w-md relative color-black text-black'>
            <button
              className='absolute top-0 right-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-black m-2 w-8 h-8 flex items-center justify-center'
              onClick={() => {
                router.refresh();

                setTimeout(() => {
                  router.back();
                }, 100);
              }}
              type='button'
            >
              X
            </button>
            {children}
          </div>
        </div>,
        container
      );
    }
  }
  return null;
};

export default Modal;
