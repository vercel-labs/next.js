/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  throw new Error("Deliberate test error to trigger the error overlay.");

  return (
    <div>
      <h1>You should not see this.</h1>
    </div>
  );
}
