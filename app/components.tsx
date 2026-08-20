'use client'

type MyProps = {
  myFunc: () => void
}

// 1. `export default <identifier>` — NO TS71007 warning (the bug)
const myComponent = ({ myFunc }: MyProps) => {
  myFunc()
  return <></>
}

export default myComponent

// 2. `export const` arrow function — warns as expected
export const myComponent2 = ({ myFunc }: MyProps) => {
  myFunc()
  return <></>
}

// 3. `export function` — warns as expected
export function myComponent3({ myFunc }: MyProps) {
  myFunc()
  return <></>
}
