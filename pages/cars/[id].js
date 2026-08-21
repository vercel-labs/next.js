import { useRouter } from 'next/router';
export default function Car() {
  const router = useRouter();
  return <h1 id="car">car {router.query.id}</h1>;
}
