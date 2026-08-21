export const getServerSideProps = () => {
  return {
    props: {
      foo: 1
    }
  }
}

export default function Comp ({ foo }: { foo: number }) {
  return foo
}