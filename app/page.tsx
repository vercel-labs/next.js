import { ClientComponentWithWorker } from "./ClientComponentWithWorker";

export const runtime = "edge"; // this fails with the error ReferenceError: document is not defined
// export const runtime = "nodejs"; // this works

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  return <ClientComponentWithWorker />;
}
