export default function Page() {
  return (
    <div>
      <div className="x:max-xl:hidden">hidden under 80rem</div>
      <div className="x:max-lg:block">block under 64rem</div>
    </div>
  )
}
