export default function PageB({ searchParams }) {
  return <p>b q={searchParams.q ?? 'none'}</p>;
}
