const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export default async function Default() { await sleep(3000); return <div>Slot default done</div>; }
