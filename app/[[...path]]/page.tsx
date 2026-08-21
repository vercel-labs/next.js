import { draftMode } from "next/headers";

/** Add your relevant code here for the issue to reproduce */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const draft = await draftMode();
  let params = undefined;

  if (draft.isEnabled) {
    params = await searchParams;
    console.log("In draft mode with search params: ", params);
  } else {
    console.log("Not in draft mode");
  }

  return (
    <div>
      <p>Draft mode is {draft.isEnabled ? "enabled" : "disabled"}</p>
      <p>Search params: {JSON.stringify(params)}</p>
    </div>
  );
}

export const generateStaticParams = async () => {
  return [
    {
      path: [],
    },
    {
      path: ["test"],
    },
  ];
};
