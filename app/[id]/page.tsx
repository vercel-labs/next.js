const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div id="content">Page {id}</div>;
};
export default Page;
