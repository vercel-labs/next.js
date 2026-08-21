export const getServerSideProps = () => {
  return {
    props: {
      foo: 3
    }
  }
}

export default function Comp ({ foo }: { foo: number }) {
  return foo
}