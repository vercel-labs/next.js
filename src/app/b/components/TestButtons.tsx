'use client';

import { useRouter } from 'next/navigation';

interface TestButtonsProps {
  currentTest: string | null;
}

export default function TestButtons({ currentTest }: TestButtonsProps) {
  const router = useRouter();

  const handleButtonClick = (value: string) => {
    router.replace(`/b?test=${value}`);
  };

  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
      <button
        onClick={() => handleButtonClick('first')}
        style={{
          padding: '12px 24px',
          backgroundColor: currentTest === 'first' ? '#0070f3' : '#eaeaea',
          color: currentTest === 'first' ? 'white' : 'black',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        First 버튼
      </button>

      <button
        onClick={() => handleButtonClick('second')}
        style={{
          padding: '12px 24px',
          backgroundColor: currentTest === 'second' ? '#0070f3' : '#eaeaea',
          color: currentTest === 'second' ? 'white' : 'black',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Second 버튼
      </button>
    </div>
  );
}
