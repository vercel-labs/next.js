export const dynamic = 'force-dynamic';
export default function Page() {
  console.log('>>> HOME PAGE rendered');
  return <main>home <a href="/other">other</a></main>;
}
