import { ImageResponse } from 'next/og';

export const size = { width: 600, height: 300 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          
          <circle cx="50" cy="50" r="40" fill="#0070f3" />
        </svg>
      </div>
    ),
    size
  );
}
