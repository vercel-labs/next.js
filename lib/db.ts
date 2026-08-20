// A deliberately non-serializable object (contains methods, class instance)
export class Db {
  name = 'module-scope-db'
  select() {
    return { from: (t: string) => `rows from ${t} via ${this.name}` }
  }
}
export const db = new Db()
