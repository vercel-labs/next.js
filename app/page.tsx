import Image from "next/image";
import mountains from "../public/mountains.jpg";

export default function Page() {
  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Image
        alt="Mountains"
        src={mountains}
        placeholder="blur"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
    </main>
  );
}
