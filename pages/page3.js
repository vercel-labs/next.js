const withAuth = () => undefined // buggy HOC returns undefined
export const getServerSideProps = withAuth()
export default function Page() { return <div id="page3">page3</div> }
