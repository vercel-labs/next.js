let instances = 0;

class Cache {
  constructor() {
    instances += 1;
    this.id = "1";
    console.log("[cache.js] module evaluated -> new Cache instance #" + instances);
  }
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
    console.log("[cache.js] setId(" + id + ")");
  }
}

const cache = new Cache();
export default cache;
