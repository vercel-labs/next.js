import Nop from "./ui/server-nop";
import { AddItemClient, RemoveItemClient } from "./ui/client-components";
import { fetchItems } from "./lib/data";

export default async function Home() {
  const data_array = await fetchItems();
  return (
    <>
      {/* comment / uncomment the following line to toggle the bug */}
      {/* <Nop /> */}
      <AddItemClient />
      <RemoveItemClient />
      <p>
        Array length: <span id="len">{data_array.length}</span>
      </p>
      <ul id="items">{data_array?.map((item) => <li key={item.id}>{item.value}</li>)}</ul>
    </>
  );
}
