import { Suspense } from "react";
import SearchForm from "../components/SearchForm";

async function ServerResults({ search }: { search: string }) {
  await new Promise((r) => setTimeout(r, 1500));
  return <div id="results">server data for &quot;{search}&quot;</div>;
}

export default async function Page(props: any) {
  const sp = await props.searchParams;
  return (
    <main>
      <h1>Server Component data + pushState</h1>
      <SearchForm />
      <Suspense fallback={<div id="fallback">SUSPENSE FALLBACK</div>}>
        <ServerResults search={sp?.search ?? ""} />
      </Suspense>
    </main>
  );
}
