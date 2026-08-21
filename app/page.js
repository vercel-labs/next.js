'use client'
export default function Page() {
  const secret = 'internal source code that should not be shipped to users'
  return <p onClick={() => console.log(secret)}>hello {secret.length}</p>
}
