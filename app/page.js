import { getItems } from './data';
import DataView from './data-view';

export default function Home() {
  return <DataView initialData={getItems(0)} />;
}
