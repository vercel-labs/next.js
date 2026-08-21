'use client';

import { type ColumnDef, flexRender, getCoreRowModel, type Table, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

type Row = { title: string };
const data: Row[] = [{ title: 'Alice' }, { title: 'Bob' }];
const COLUMNS: ColumnDef<Row>[] = [{ accessorKey: 'title', header: 'Title', cell: (c) => String(c.getValue()) }];

// Child that takes the `table` instance as a prop.
function Toolbar({ table }: { table: Table<Row> }) {
  return <button type="button">{table.getAllColumns().length}</button>;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // ⬇️ THE TRIGGER: a nested `const table` that shadows the `useReactTable` `table` below.
  //    Rename it (e.g. `dbTable`) and the bug disappears.
  //    NB: not specific to `table` — the same shape reproduces with any lowercase intrinsic name
  //    (confirmed with `section` and `label`): a local named like an intrinsic, shadowed and passed
  //    as a prop, next to that `<intrinsic>` tag.
  useEffect(() => {
    const dbTable = "seo_articles";
    void dbTable;
  }, []);

  const table = useReactTable({ data, columns: COLUMNS, getCoreRowModel: getCoreRowModel() });

  const toolbar = <Toolbar table={table} />; // `table` passed as a prop

  // isLoading makes the server render WITHOUT the <table>, so the client's mis-compiled <table_0>
  // is a genuine element (not reconciled back to the server's <table>).
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
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
