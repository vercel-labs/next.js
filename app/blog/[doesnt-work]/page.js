export const dynamic = "force-static";
export const dynamicParams = true;

const Page = async ({ params }) => {
  const resolvedParams = await params;
  console.log(resolvedParams);
  return <div>{JSON.stringify(resolvedParams)}</div>;
};

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  console.log(resolvedParams);
  return { title: "hello" };
};

export const generateStaticParams = () => {
  return [{ "doesnt-work": "pregenerated" }];
};

export default Page;
