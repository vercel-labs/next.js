export const dynamic = "force-dynamic";
const HelloPage = async () => {
  return await fetch(process.env.API_URL!)
    .then((response) => response.json())
    .then((data) => (
      <div>
        <h1>API Response</h1>
        <pre>{JSON.stringify(data)}</pre>
      </div>
    ))
    .catch((error) => (
      <div>
        <h1>Error</h1>
        <pre>{JSON.stringify({ message: error?.message, cause: error?.cause })}</pre>
      </div>
    ));
};
export default HelloPage;
