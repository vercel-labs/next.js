export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}
export default function Detail({ id }) {
  return (
    <main>
      <h1 id="page-title">Detail Page {id}</h1>
    </main>
  );
}
