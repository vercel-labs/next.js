export const dynamic = "force-dynamic";
export default function Page() {
  console.log('[exact] Global Test: ', global._foo, 'pid:', process.pid);
  if (!global._foo) {
    global._foo = 'hello';
    console.log('[exact] Initializing global variable');
  }
  return <p>exact</p>;
}



// mark 4
// t 1
// t 2
// t 3
// t 1
// t 2
// t 3
