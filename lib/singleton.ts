// Framework-level illustration of the same bug without Storyblok:
// module-level singleton state initialised from app/layout.tsx.
let value: string | null = null;
export function initSingleton() {
  value = 'initialised-by-layout';
}
export function getSingleton() {
  return value;
}
