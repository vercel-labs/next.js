export default function Page() {
  // Type error: string annotated but number assigned.
  const test: string = 123
  // Unused variable (caught by @typescript-eslint/no-unused-vars in next/typescript)
  const unused = 1
  return <p>{test}</p>
}
