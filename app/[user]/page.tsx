import { track } from '../actions';

export default async function User({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;
  const n = await track(`dynamic /${user}`);
  return <p>dynamic route {user}, requests={n}</p>;
}
