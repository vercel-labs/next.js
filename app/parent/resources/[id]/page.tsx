export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div data-testid="full-page">Full page resource {id}</div>;
}
