export default function Page() {
  return <p>{process.env.NEXT_PUBLIC_MY_VAR ?? 'NEXT_PUBLIC_MY_VAR is undefined'}</p>
}
