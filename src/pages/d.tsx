export const getServerSideProps = () => {
  return {
    props: {
      foo: 4
    }
  }
}

export default function Comp ({ foo }: { foo: number }) {
  return foo
}