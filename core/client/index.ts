import { headers } from 'next/headers';
// eslint-disable-next-line
const lib = require('mylib');

export const client = {
  fetch: async () => ({ ok: true, lib }),
  _h: headers,
};
