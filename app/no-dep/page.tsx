'use client';

import { useEffect, useMemo, useState } from 'react';

function useFakeTable() {
  return useMemo(() => ({ id: 'x', getAllColumns: () => [1] }), []);
}

function Toolbar({ table }: { table: { getAllColumns: () => number[] } }) {
  return <button type="button">{table.getAllColumns().length}</button>;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const table = 'seo_articles';
    void table;
  }, []);

  const table = useFakeTable();
  const toolbar = <Toolbar table={table} />;

  if (isLoading)
    return (
      <>
        {toolbar}
        <div>loading…</div>
      </>
    );

  return (
    <>
      {toolbar}
      <table>
        <tbody>
          <tr>
            <td>{table.id}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
