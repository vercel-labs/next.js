import { WhoServedMe } from "./who-served-me";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main>
      <h1>next-prebuilt-skew-protection-repro</h1>
      <p>
        runtime NEXT_DEPLOYMENT_ID:{" "}
        <span id="runtime-deployment-id">{process.env.NEXT_DEPLOYMENT_ID ?? "(unset)"}</span>
      </p>
      <p>
        VERCEL_DEPLOYMENT_ID:{" "}
        <span id="vercel-deployment-id">{process.env.VERCEL_DEPLOYMENT_ID ?? "(unset)"}</span>
      </p>
      <p>
        VERCEL_SKEW_PROTECTION_ENABLED:{" "}
        <span id="skew-enabled">{process.env.VERCEL_SKEW_PROTECTION_ENABLED ?? "(unset)"}</span>
      </p>
      <WhoServedMe />
    </main>
  );
}
