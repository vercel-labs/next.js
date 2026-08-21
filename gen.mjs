import fs from 'node:fs';
const pages = 6;
for (let i = 0; i < pages; i++) {
  const dir = `app/p${i}`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/page.tsx`, `'use client';
import * as Icons from 'react-icons/fa';
import { format } from 'date-fns';
import _ from 'lodash';
import { z } from 'zod';
const S = z.object({ a: z.string() });
export default function P${i}() {
  const keys = _.take(Object.keys(Icons), 20);
  return <div>{'p${i}'} {format(new Date(0), 'yyyy')} {keys.join(',')} {String(S.safeParse({a:'x'}).success)}</div>;
}
`);
}
fs.mkdirSync('app', { recursive: true });
fs.writeFileSync('app/page.tsx', `export default function Home() { return <div>home</div>; }\n`);
