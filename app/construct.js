export const construct = () => new class {
  #test = 99
  get test() { return this.#test }
}
