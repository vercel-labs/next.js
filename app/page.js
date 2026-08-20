import Image from 'next/image';
import big from '../public/big.jpg';

export default function Page() {
  return (
    <main>
      <h2>A: intrinsic width/height (5000x5000) in a 100px box (as docs advise)</h2>
      <div id="a" style={{ width: 100, height: 100 }}>
        <Image src="/big.jpg" width={5000} height={5000} alt="a" style={{ width: '100%', height: '100%' }} />
      </div>

      <h2>B: rendered width/height (100x100) in a 100px box</h2>
      <div id="b" style={{ width: 100, height: 100 }}>
        <Image src="/big.jpg" width={100} height={100} alt="b" style={{ width: '100%', height: '100%' }} />
      </div>

      <h2>C: static import (5000x5000) in a 100px box</h2>
      <div id="c" style={{ width: 100, height: 100 }}>
        <Image src={big} alt="c" style={{ width: '100%', height: '100%' }} />
      </div>
    </main>
  );
}
