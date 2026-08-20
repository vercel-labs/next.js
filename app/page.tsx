import List from './List';
import Item from './Item';
import ServerItem from './ServerItem';

export default function Page() {
  return (
    <List>
      <Item />
      <ServerItem />
    </List>
  );
}
