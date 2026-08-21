'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchData } from '../actions';

export default function ExampleComponent() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const result = await fetchData();
      setData(result);
    }
    getData();
  }, []);

  const handleRefresh = () => {
    router.refresh();
    console.log('Refresh triggered');
  };

  return (
    <div>
      <h1 id="out">Data from server: {data ? JSON.stringify(data) : 'Loading...'}</h1>
      <button id="btn" onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
}
