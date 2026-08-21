export const getServerSideProps = () => {
  return {
    props: {
      foo: 2
    }
  }
}

export default function Comp ({ foo }: { foo: number }) {
  return foo
}