import Image from 'next/image';
import localPic from '../images/photo.jpeg'; // 1920x1280

const box = { width: 300, position: 'relative', paddingTop: 200, marginBottom: 24 };

export default function Home() {
  return (
    <main style={{ margin: 0 }}>
      {/* 1. fill + sizes using calc() -> sizes is ignored when building srcSet */}
      <div id="case1" style={box}>
        <Image src={localPic} alt="" fill sizes="calc(33vw - 6rem)" />
      </div>

      {/* 2. control: fill + plain vw sizes -> srcSet is narrowed */}
      <div id="case2" style={box}>
        <Image src={localPic} alt="" fill sizes="33vw" />
      </div>

      {/* 3. width/height, no sizes, downscaled by CSS to 300px */}
      <div id="case3" style={{ width: 300 }}>
        <Image src={localPic} alt="" width={800} height={533} style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* 4. static import, no width/height/sizes, downscaled by CSS to 300px */}
      <div id="case4" style={{ width: 300 }}>
        <Image src={localPic} alt="" style={{ width: '100%', height: 'auto' }} />
      </div>
    </main>
  );
}
