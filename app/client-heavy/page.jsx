import Table from './table';
import { bigRows, jsonLd } from '../big-data';

export default function Page() {
  return <Table rows={bigRows()} jsonLd={jsonLd} />;
}
