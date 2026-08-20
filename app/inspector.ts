export function inspector(): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('inspector').url()
}
