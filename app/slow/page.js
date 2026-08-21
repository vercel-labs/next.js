export default async function Page() {
  await new Promise((r) => setTimeout(r, 2000));
  const data = await fetch('https://api.vercel.app/blog', { cache: 'no-store' });
  const posts = await data.json();
  return (
    <div>
      <section className="p-8 flex flex-col h-full justify-center">
        <h1 className="text-3xl font-bold font-poppins">Next Starter ⚡ ({posts.length})</h1>
        <p className="text-lg">A highly opinionated and complete starter</p>
      </section>
    </div>
  );
}
