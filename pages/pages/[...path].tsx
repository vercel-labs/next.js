export const getServerSideProps = async (ctx: any) => ({
  props: { path: ctx.params.path ?? null, url: ctx.req.url ?? null },
})

export default function Page({ path, url }: { path: string[]; url: string }) {
  return (
    <>
      <div id="out">{JSON.stringify(path)}</div>
      <div id="url">{url}</div>
    </>
  )
}
