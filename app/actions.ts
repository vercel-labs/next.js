"use server";

export async function whoServedMe() {
  return {
    runtimeDeploymentId: process.env.NEXT_DEPLOYMENT_ID ?? null,
    vercelDeploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
  };
}
