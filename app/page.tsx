import { problemAction } from "./_actions";
import { login } from "./_enum-actions";
export default function Home() {
  return (<><form action={problemAction as any}><button type="submit">a</button></form><form action={login}><button type="submit">b</button></form></>);
}
