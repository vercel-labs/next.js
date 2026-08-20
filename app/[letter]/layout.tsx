import Link from 'next/link'

type Props = {
  children: React.ReactNode
  slot1: React.ReactNode
  slot2: React.ReactNode
  slot3: React.ReactNode
  slot4: React.ReactNode
  slot5: React.ReactNode
  slot6: React.ReactNode
  slot7: React.ReactNode
  slot8: React.ReactNode
  slot9: React.ReactNode
  slot10: React.ReactNode
  slot11: React.ReactNode
  slot12: React.ReactNode
  slot13: React.ReactNode
  slot14: React.ReactNode
  slot15: React.ReactNode
  slot16: React.ReactNode
  slot17: React.ReactNode
  slot18: React.ReactNode
  slot19: React.ReactNode
  slot20: React.ReactNode
}

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export default function LetterLayout(props: Props) {
  return (
    <div>
      <div>{props.children}</div>
      <div>{props.slot1}</div>
      <div>{props.slot2}</div>
      <div>{props.slot3}</div>
      <div>{props.slot4}</div>
      <div>{props.slot5}</div>
      <div>{props.slot6}</div>
      <div>{props.slot7}</div>
      <div>{props.slot8}</div>
      <div>{props.slot9}</div>
      <div>{props.slot10}</div>
      <div>{props.slot11}</div>
      <div>{props.slot12}</div>
      <div>{props.slot13}</div>
      <div>{props.slot14}</div>
      <div>{props.slot15}</div>
      <div>{props.slot16}</div>
      <div>{props.slot17}</div>
      <div>{props.slot18}</div>
      <div>{props.slot19}</div>
      <div>{props.slot20}</div>
      <ul>
        {letters.map((l) => (
          <li key={l}>
            <Link href={'/' + l}>card {l}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
