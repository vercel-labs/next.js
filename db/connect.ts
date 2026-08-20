import fs from 'node:fs';

const COUNT_FILE = '/tmp/connection-count.txt';

class DatabaseConnection {
  id: number;
  constructor() {
    // simulate opening a real DB connection
    const prev = fs.existsSync(COUNT_FILE) ? Number(fs.readFileSync(COUNT_FILE, 'utf8')) : 0;
    this.id = prev + 1;
    fs.writeFileSync(COUNT_FILE, String(this.id));
    console.log(`[db] OPENED connection #${this.id} (module evaluated)`);
  }
}

// Pattern from Next.js docs "Sharing data between Server Components"
export const db = new DatabaseConnection();
