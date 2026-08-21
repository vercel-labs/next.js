import Link from 'next/link';
import { Header } from './components/Header';

export default function Page() {
  return <Header linkComponent={Link} />;
}
