"use cache";

export default async function Parent({ getStuff }) {
  console.log("render Parent");
  return (
    <>
      {getStuff()}
    </>
  );
}
