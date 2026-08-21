export const getServerSideProps = async () => ({ props: {
  uncaught: process.listeners('uncaughtException').length,
  names: process.listeners('uncaughtException').map(l => l.name || 'anonymous').join(', '),
  unhandled: process.listeners('unhandledRejection').length,
} })
export default function Home(p) { return <pre>{JSON.stringify(p, null, 2)}</pre> }
