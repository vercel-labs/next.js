import fs from 'node:fs';

const COUNT_FILE = '/tmp/connection-count-global.txt';

class DatabaseConnection {
  id: number;
  constructor() {
    const prev = fs.existsSync(COUNT_FILE) ? Number(fs.readFileSync(COUNT_FILE, 'utf8')) : 0;
    this.id = prev + 1;
    fs.writeFileSync(COUNT_FILE, String(this.id));
    console.log(`[db-global] OPENED connection #${this.id}`);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var dbGlobal: DatabaseConnection | undefined;
}

function connectOnce() {
  if (!globalThis.dbGlobal) globalThis.dbGlobal = new DatabaseConnection();
  return globalThis.dbGlobal;
}

export const dbGlobal = connectOnce();
