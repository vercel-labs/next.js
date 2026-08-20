import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import ClientWithMoment from "./client-with-moment";
import ClientWithJquery from "./client-with-jquery";

async function toggle(name: string) {
  const c = await cookies();
  c.set(name, c.get(name)?.value === "1" ? "0" : "1");
  revalidatePath("/");
}

export default async function Home() {
  const c = await cookies();
  const showMoment = c.get("MOMENT")?.value === "1";
  const showJquery = c.get("JQUERY")?.value === "1";

  return (
    <main>
      <h1>RSC client chunk bundling demo</h1>
      <form
        action={async () => {
          "use server";
          await toggle("MOMENT");
        }}
      >
        <button type="submit">toggle moment CC (now: {String(showMoment)})</button>
      </form>
      <form
        action={async () => {
          "use server";
          await toggle("JQUERY");
        }}
      >
        <button type="submit">toggle jquery CC (now: {String(showJquery)})</button>
      </form>
      {showMoment && <ClientWithMoment />}
      {showJquery && <ClientWithJquery />}
    </main>
  );
}

export const dynamic = "force-dynamic";
