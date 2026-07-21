import { getHeapStatistics } from 'node:v8'

type Props = {
  heapSizeLimit: number
}

export default function Page({ heapSizeLimit }: Props) {
  return <p id="heap-size-limit">{heapSizeLimit}</p>
}

export function getStaticProps() {
  return {
    props: {
      heapSizeLimit: getHeapStatistics().heap_size_limit,
    },
  }
}
