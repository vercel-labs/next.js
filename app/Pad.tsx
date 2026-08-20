const para =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in tincidunt elit. Fusce accumsan enim purus, ut sodales felis iaculis et. Aliquam accumsan turpis odio, sed tristique lectus eleifend a. Fusce lorem tellus, consequat a dolor non, imperdiet lacinia odio. Duis et ligula egestas, convallis tellus vitae, hendrerit tortor. '

export default function Pad() {
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <p key={i}>{para.repeat(4)}</p>
      ))}
    </>
  )
}
