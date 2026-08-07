import { ImageResponse } from '@takumi-rs/image-response';
export async function GET() {
  return new ImageResponse(<div style={{ display: 'flex' }}>hi</div>, { width: 200, height: 100 });
}
