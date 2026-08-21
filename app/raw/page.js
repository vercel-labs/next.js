import { logo } from 'my-assets';

export default function Raw() {
  return (
    <pre id="raw">{typeof logo} :: {JSON.stringify(logo)}</pre>
  );
}
