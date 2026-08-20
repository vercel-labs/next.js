const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export default async function Page() { await sleep(3000); return <div>Parent page done</div>; }
