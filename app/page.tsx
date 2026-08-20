import { Suspense } from "react";
import SearchForm from "./components/SearchForm";
import ClientResults from "./components/ClientResults";

export default function Page() {
  return (
    <main>
      <SearchForm />
      <Suspense fallback={<div id="fallback">SUSPENSE FALLBACK</div>}>
        <ClientResults />
      </Suspense>
    </main>
  );
}
