import { StockLabel } from "../components/stock-label";

export default function Page() {
  return (
    <main>
      <h1>next/dynamic ssr:false + use(serverAction)</h1>
      <StockLabel slug="women_corp_jacket" />
    </main>
  );
}
