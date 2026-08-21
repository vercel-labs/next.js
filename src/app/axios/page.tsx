import axios from 'axios';

export default async function AxiosPage() {
  await axios.get('http://localhost:4000/', {
    signal: AbortSignal.timeout(1000),
    adapter: 'fetch',
  });
  return (
    <div>
      <h1>Axios Page</h1>
    </div>
  );
}
