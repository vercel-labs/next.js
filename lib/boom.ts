export function boom(): never {
  // boom() is thrown on line 3 of lib/boom.ts
  throw new Error("kaboom from lib/boom.ts line 3");
}
