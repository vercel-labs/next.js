// This file exists purely to add bloat to the JS bundle
// node-sql-parser is a large package that will significantly increase bundle size

import { Parser } from 'node-sql-parser';

// Just importing and instantiating adds significant bundle size
export const parser = new Parser();

// Add some dummy usage to ensure it's not tree-shaken
export function parseSomeSQL() {
  const sql = 'SELECT * FROM users WHERE id = 1';
  return parser.astify(sql);
}

// Execute on module load to ensure it's included
if (typeof window !== 'undefined') {
  console.log('SQL Parser loaded');
}
