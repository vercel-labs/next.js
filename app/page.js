import Image from "next/image";

export default function Page() {
  return (
    <main>
      <h1>next/image public asset with basePath</h1>
      <Image src="/logo.svg" alt="Public logo" width={120} height={60} />
    </main>
  );
}
